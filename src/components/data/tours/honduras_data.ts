import type { ImageMetadata } from "astro";

import velero6 from "../../../assets/photos_azulia_webp/velero/velero_6.webp";
import velero8 from "../../../assets/photos_azulia_webp/velero/velero_8.webp";
import velero9 from "../../../assets/photos_azulia_webp/velero/velero_9.webp";
import kayak5 from "../../../assets/photos_azulia_webp/Kayak/kayak (5).webp";
import kayak7 from "../../../assets/photos_azulia_webp/Kayak/kayak (7).webp";
import pontom4 from "../../../assets/photos_azulia_webp/ponton/pontom_4.webp";

export interface Tour {
    id: string;
    name: string;
    description: string;
    icon: string;
    image: ImageMetadata;
}

export interface ModalData {
    id: string;
    title: string;
    images: string[];
    schedule: string;
    price: string;
    text: string;
    rating: string;
    duration: string[];
    capacity: string;
    ageRange: string;
    includes: string[];
    nearby: string[];
}

export const hondurasTours: Tour[] = [
    {
        id: "roatan",
        name: "Roatán",
        description: "Bucea en los arrecifes de Roatán, parte del Arrecife Mesoamericano, el segundo sistema de arrecifes de coral más grande del mundo.",
        icon: "scuba_diving",
        image: velero8,
    },
    {
        id: "copan",
        name: "Ruinas de Copán",
        description: "Visita las ruinas mayas de Copán, famosas por sus extraordinarios relieves esculturales y la monumental escalinata jeroglífica.",
        icon: "account_balance",
        image: kayak5,
    },
    {
        id: "utila",
        name: "Utila – Islas de la Bahía",
        description: "Conoce Utila, el paraíso del buceo en el Caribe donde puedes nadar con tiburones ballena y obtener tu certificación PADI.",
        icon: "sailing",
        image: velero6,
    },
];

export const modalData: ModalData[] = [
    {
        id: "roatan",
        title: "Roatán, Honduras",
        images: [velero8.src, velero9.src],
        schedule: "5:00 AM - día siguiente",
        price: "$2,600 MXN",
        text: "Roatán es la joya de las Islas de la Bahía de Honduras. Sus arrecifes están considerados entre los mejores del Caribe, con visibilidad de hasta 30 metros. Buceo, snorkel, kayak y playas de postal en una sola aventura de dos días.",
        rating: "4.9 de 5.0",
        duration: ["2 días / 1 noche"],
        capacity: "6 personas",
        ageRange: "Mayor de 8 años",
        includes: ["Vuelo o transporte", "Alojamiento 1 noche", "2 inmersiones de buceo", "Equipo completo", "Instructor certificado", "Comidas incluidas"],
        nearby: ["Utila - 30 km náuticos", "Guanaja - 50 km", "La Ceiba - 60 km"],
    },
    {
        id: "copan",
        title: "Ruinas de Copán",
        images: [kayak5.src, pontom4.src],
        schedule: "4:00 AM - 10:00 PM",
        price: "$2,200 MXN",
        text: "Copán es conocida como la 'Atenas del Nuevo Mundo' por la sofisticación de su arte y arquitectura maya. La escalinata jeroglífica de 63 escalones es el texto maya más largo jamás descubierto. Una visita obligatoria para amantes de la historia.",
        rating: "4.8 de 5.0",
        duration: ["18 horas"],
        capacity: "8 personas",
        ageRange: "Todas las edades",
        includes: ["Transporte privado", "Cruce fronterizo", "Entrada a zona arqueológica", "Guía arqueólogo", "Almuerzo", "Seguro de viaje"],
        nearby: ["Copán Ruinas Town - 1 km", "Las Sepulturas - 2 km", "Santa Rosa de Copán - 50 km"],
    },
    {
        id: "utila",
        title: "Utila – Islas de la Bahía",
        images: [velero6.src, kayak7.src],
        schedule: "5:00 AM - día siguiente",
        price: "$1,800 MXN",
        text: "Utila es famosa mundialmente como uno de los lugares más económicos para obtener la certificación PADI. Sus aguas son hogar de tiburones ballena durante todo el año. La isla tiene un ambiente relajado y vibrante, perfecta para aventureros.",
        rating: "4.8 de 5.0",
        duration: ["2 días / 1 noche"],
        capacity: "8 personas",
        ageRange: "Mayor de 10 años",
        includes: ["Transporte hasta La Ceiba", "Ferry a Utila", "Alojamiento 1 noche", "Snorkel o buceo introductorio", "Guía marino", "Desayuno incluido"],
        nearby: ["Roatán - 30 km náuticos", "La Ceiba - ferry 1h", "West End - en sitio"],
    },
];
