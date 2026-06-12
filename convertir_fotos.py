import os
from pathlib import Path
from PIL import Image
from tqdm import tqdm

def optimizar_a_webp():
    # Extensiones compatibles a buscar
    extensiones_validas = {'.jpg', '.jpeg', '.png', '.bmp', '.tiff'}
    
    directorio_base = Path('.')
    archivos_a_procesar = []
    
    print("Analizando el árbol de directorios en busca de imágenes...")
    
    # rglob('*') busca recursivamente desde el nivel donde se ejecuta el script
    for ruta_archivo in directorio_base.rglob('*'):
        if ruta_archivo.is_file() and ruta_archivo.suffix.lower() in extensiones_validas:
            ruta_webp = ruta_archivo.with_suffix('.webp')
            
            # Condición: si la foto ya tiene su par en webp, se omite
            if not ruta_webp.exists():
                archivos_a_procesar.append(ruta_archivo)

    if not archivos_a_procesar:
        print("No se encontraron imágenes pendientes por convertir.")
        return

    print(f"Se encolaron {len(archivos_a_procesar)} imágenes para optimización.")
    
    informe_errores = []
    
    # tqdm genera la barra de progreso en la terminal
    for ruta_archivo in tqdm(archivos_a_procesar, desc="Convirtiendo", unit="img"):
        ruta_webp = ruta_archivo.with_suffix('.webp')
        
        try:
            with Image.open(ruta_archivo) as img:
                # Normalización de canales de color para evitar errores de escritura
                if img.mode not in ('RGB', 'RGBA'):
                    # Si tiene canal alfa (transparencia), lo pasamos a RGBA, si no a RGB
                    img = img.convert('RGBA') if 'A' in img.mode else img.convert('RGB')
                
                # lossless=True y quality=100 garantizan que no haya compresión destructiva
                img.save(ruta_webp, 'webp', lossless=True, quality=100)
                
        except Exception as e:
            # Capturamos el error sin detener el loop para continuar con el resto
            informe_errores.append(f"❌ Fallo en '{ruta_archivo}': {str(e)}")

    # Salida del informe de errores
    print("\n" + "="*40)
    if informe_errores:
        print("⚠️ INFORME DE ERRORES")
        for error in informe_errores:
            print(error)
    else:
        print("✅ Conversión finalizada con éxito. Ningún error detectado.")
    print("="*40)

if __name__ == "__main__":
    optimizar_a_webp()