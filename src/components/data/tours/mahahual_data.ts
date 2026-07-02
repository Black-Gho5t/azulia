import type { ImageMetadata } from "astro";

import mahahual2 from "../../../assets/photos_azulia_webp/Mahahual/mahahual (2).webp";
import mahahual4 from "../../../assets/photos_azulia_webp/Mahahual/mahahual (4).webp";
import mahahual5 from "../../../assets/photos_azulia_webp/Mahahual/mahahual (5).webp";
import mahahual6 from "../../../assets/photos_azulia_webp/Mahahual/mahahual (6).webp";
import mahahual7 from "../../../assets/photos_azulia_webp/Mahahual/mahahual (7).webp";

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

export const mahahualTours: Tour[] = [
    {
        id: "banco-chinchorro",
        name: "Banco Chinchorro",
        description: "Sumérgete en el atolón de coral más grande del hemisferio norte, hogar de tiburones enfermeros, tortugas y manta rayas.",
        icon: "scuba_diving",
        image: mahahual4,
    },
    {
        id: "kayak-manglares",
        name: "Kayak en Manglares",
        description: "Explora los secretos del ecosistema manglar de Mahahual en kayak, donde la naturaleza se desborda en cada rincón tranquilo.",
        icon: "kayaking",
        image: mahahual6,
    },
    {
        id: "costa-mahahual",
        name: "Costa de Mahahual",
        description: "Recorre en lancha la espectacular costa de Mahahual, deteniéndote en playas vírgenes y arrecifes poco explorados.",
        icon: "directions_boat",
        image: mahahual7,
    },
];

export const modalData: ModalData[] = [
    {
        id: "banco-chinchorro",
        title: "Banco Chinchorro",
        images: [mahahual4.src, mahahual5.src],
        schedule: "6:30 AM - 3:00 PM",
        price: "$1,600 MXN",
        text: "Banco Chinchorro es el atolón de arrecife más grande del hemisferio norte. Sus aguas albergan miles de especies marinas, incluyendo los famosos tiburones enfermeros y tortugas de mar. Viajamos en lancha desde Mahahual para llegar a este paraíso sumergido, único en el mundo.",
        rating: "5.0 de 5.0",
        duration: ["Tour completo: 8.5 horas"],
        capacity: "8 personas",
        ageRange: "Mayor de 8 años",
        includes: ["Lancha rápida", "Equipo de snorkel/buceo", "Guía certificado", "Almuerzo en el atolón", "Agua y bebidas", "Seguro acuático"],
        nearby: ["Mahahual - 47 km náuticos", "Arrecife Mesoamericano - en ruta", "Xcalak - 60 km"],
    },
    {
        id: "kayak-manglares",
        title: "Kayak en Manglares",
        images: [mahahual6.src, mahahual2.src],
        schedule: "8:00 AM - 12:00 PM",
        price: "$650 MXN",
        text: "Los manglares de Mahahual son un ecosistema único repleto de vida. En kayak silencioso llegarás a lugares que ninguna lancha puede alcanzar. Observa aves exóticas, peces de colores y quizás un manatí entre las raíces. Un tour perfecto para familias y amantes de la naturaleza.",
        rating: "4.8 de 5.0",
        duration: ["4 horas"],
        capacity: "10 personas",
        ageRange: "Todas las edades",
        includes: ["Kayak doble o individual", "Chaleco salvavidas", "Guía naturalista", "Agua y snacks", "Binoculares"],
        nearby: ["Centro de Mahahual - 2 km", "Arrecife de coral - 1 km", "Costa Maya - 3 km"],
    },
    {
        id: "costa-mahahual",
        title: "Costa de Mahahual",
        images: [mahahual7.src, mahahual4.src],
        schedule: "9:00 AM - 2:00 PM",
        price: "$900 MXN",
        text: "La costa de Mahahual esconde joyas que pocos turistas conocen. En nuestra lancha privada te llevaremos a snorkelear en arrecifes vírgenes, visitar playas sin nombre y disfrutar de un almuerzo de mariscos frescos en una palapa a orillas del mar.",
        rating: "4.7 de 5.0",
        duration: ["5 horas"],
        capacity: "10 personas",
        ageRange: "Todas las edades",
        includes: ["Lancha privada", "Equipo de snorkel", "Almuerzo de mariscos", "Bebidas", "Guía local"],
        nearby: ["Xcalak - 65 km", "Banco Chinchorro - 47 km náuticos", "Centro de Mahahual - en sitio"],
    },
];
