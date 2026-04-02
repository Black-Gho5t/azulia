import os
import argparse
from PIL import Image
from concurrent.futures import ThreadPoolExecutor, as_completed
from tqdm import tqdm

# Extensiones válidas
EXT_VALIDAS = ('.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.gif')


def obtener_imagenes(origen):
    imagenes = []
    for root, _, files in os.walk(origen):
        for file in files:
            if file.lower().endswith('.webp'):
                continue
            if file.lower().endswith(EXT_VALIDAS):
                imagenes.append(os.path.join(root, file))
    return imagenes


def construir_ruta_destino(ruta_archivo, origen, destino_base):
    ruta_relativa = os.path.relpath(os.path.dirname(ruta_archivo), origen)
    nueva_carpeta = os.path.join(destino_base, ruta_relativa)
    os.makedirs(nueva_carpeta, exist_ok=True)

    nombre_sin_ext = os.path.splitext(os.path.basename(ruta_archivo))[0]
    return os.path.join(nueva_carpeta, nombre_sin_ext + ".webp")


def convertir_imagen(ruta_archivo, origen, destino_base, lossless, calidad):
    try:
        nueva_ruta = construir_ruta_destino(ruta_archivo, origen, destino_base)

        with Image.open(ruta_archivo) as img:
            # Mantener transparencia si existe
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGBA")
            else:
                img = img.convert("RGB")

            if lossless:
                img.save(nueva_ruta, "WEBP", lossless=True)
            else:
                img.save(nueva_ruta, "WEBP", quality=calidad)

        return (ruta_archivo, None)

    except Exception as e:
        return (ruta_archivo, str(e))


def main():
    parser = argparse.ArgumentParser(
        description="Convierte imágenes a WebP manteniendo estructura de carpetas"
    )
    parser.add_argument("ruta", help="Ruta de la carpeta origen")
    parser.add_argument("--calidad", type=int, default=100,
                        help="Calidad (1-100) si no es lossless (default: 100)")
    parser.add_argument("--lossless", action="store_true",
                        help="Usar compresión sin pérdida")
    parser.add_argument("--hilos", type=int, default=4,
                        help="Número de hilos (default: 4)")

    args = parser.parse_args()

    origen = os.path.abspath(args.ruta)

    if not os.path.isdir(origen):
        print("❌ Ruta inválida")
        return

    base_dir = os.path.dirname(origen)
    nombre_carpeta = os.path.basename(origen)
    destino = os.path.join(base_dir, nombre_carpeta + "_webp")

    print(f"📂 Origen: {origen}")
    print(f"📁 Destino: {destino}")
    print("🔍 Buscando imágenes...")

    imagenes = obtener_imagenes(origen)

    print(f"🖼️ Total encontradas: {len(imagenes)}")
    print("🚀 Iniciando conversión...\n")

    errores = []

    with ThreadPoolExecutor(max_workers=args.hilos) as executor:
        futuros = [
            executor.submit(
                convertir_imagen,
                img,
                origen,
                destino,
                args.lossless,
                args.calidad
            )
            for img in imagenes
        ]

        for future in tqdm(as_completed(futuros), total=len(futuros)):
            archivo, error = future.result()
            if error:
                errores.append((archivo, error))

    print("\n✅ Conversión completada")

    if errores:
        print(f"\n⚠️ Errores ({len(errores)}):")
        for archivo, error in errores[:10]:
            print(f"- {archivo}: {error}")


if __name__ == "__main__":
    main()
