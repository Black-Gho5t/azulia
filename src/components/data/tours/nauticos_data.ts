// src/data/tours.ts
import type { ImageMetadata } from "astro";

// Importaciones de imágenes (se procesan correctamente a través de Vite en este archivo)
import velero2 from "../../../assets/photos_azulia_webp/velero/velero_2.webp";
import velero4 from "../../../assets/photos_azulia_webp/velero/velero_4.webp";
import velero5 from "../../../assets/photos_azulia_webp/velero/velero_5.webp";
import pontom from "../../../assets/photos_azulia_webp/ponton/pontom_8.webp";
import pontom2 from "../../../assets/photos_azulia_webp/ponton/pontom_2.webp";
import kayak from "../../../assets/photos_azulia_webp/Kayak/kayak (3).webp";
import paddle from "../../../assets/photos_azulia_webp/paddle/paddle (4).webp";

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

export const nauticosTours: Tour[] = [
    {
        id: "velero",
        name: "Velero",
        description: "Explora las aguas de la laguna de bacalar en uno de nuestros preciosos veleros",
        icon: "sailing",
        image: velero2,
    },
    {
        id: "ponton",
        name: "Ponton",
        description: "Disfruta de un dia increible con la familia o amigos en un espacioso ponton",
        icon: "directions_boat",
        image: pontom,
    },
    {
        id: "kayak",
        name: "Kayak",
        description: "Comparte una experiencia unica y relajante por las aguass en nuestros kayaks",
        icon: "kayaking",
        image: kayak,
    },
    {
        id: "paddle",
        name: "Paddle",
        description: "Bucea en arrecifes de coral y observa la vida marina tropical. Incluye equipo completo y guía especializado.",
        icon: "rowing",
        image: paddle,
    },
    {
        id: "snorkel",
        name: "Snorkel",
        description: "Explora los arrecifes del sur de Mexico, decubre un nuevo mundo en el fondo de las aguas",
        icon: "scuba_diving",
        image: kayak,
    },
    {
        id: "lancha", // Corregido ID duplicado temporalmente aquí para evitar conflictos de renderizado
        name: "Lancha",
        description: "Explora los arrecifes del sur de Mexico, decubre un nuevo mundo en el fondo de las aguas",
        icon: "directions_boat",
        image: kayak,
    },
    {
        id: "moto",
        name: "Moto acuatica",
        description: "Siente la adrenalina de conducir una increible moto acuatica por la laguna de bacalar y sus alrededores",
        icon: "snowmobile",
        image: kayak
    }
];

export const modalData: ModalData[] = [
    {
        id: "velero",
        title: "Velero",
        images: [velero2.src, velero4.src],
        schedule: "8:00 AM - 11:00 AM - 3:00 PM",
        price: "$500 MXN",
        text: "Vive la experiencia clásica de navegar en un velero tradicional. Nuestro velero de madera te llevará a través de las aguas más hermosas del Caribe. Con posibilidad de rentar una unidad privada o compartir la experiencia en un velero colectivo.",
        rating: "4.8 de 5.0",
        duration: ["Privado: 3 - 5 horas\n", "Colectivo: 3 horas"],
        capacity: "8 personas",
        ageRange: "Todas las edades",
        includes: ["Snacks", "Bebidas", "Equipo de seguridad", "Chaleco salvavidas"],
        nearby: ["Playa Bacalar - 2 km", "Fuerte de San Felipe - 8 km", "Centro de Bacalar - 3 km"],
    },
    {
        id: "moto",
        title: "Moto Acuática",
        images: [pontom.src, pontom2.src],
        schedule: "9:00 AM - 12:00 AM - 4:00 PM",
        price: "$450 MXN",
        text: "Adrenalina pura con nuestros tours en moto acuática última generación. Explora calas secretas y playas paradisíacas a alta velocidad bajo supervisión de instructores certificados. Traje de baño y toalla incluidos.",
        rating: "4.7 de 5.0",
        duration: ["Privado: 3 - 5 horas", "\nColectivo: 3 horas"],
        capacity: "variable",
        ageRange: "Mayor de 18 años",
        includes: ["Moto acuática última generación", "Traje de baño", "Toalla", "Instructor certificado"],
        nearby: ["Laguna Bacalar - 1 km", "Cenotes cercanos - 15 km", "Playas vírgenes - 10 km"],
    },
    {
        id: "ponton",
        title: "Pontón Familiar",
        images: [pontom2.src],
        schedule: "9:00 AM - 3:00 PM",
        price: "$400 MXN",
        text: "La opción perfecta para familias. Disfruta de un paseo relajado en pontón con plataforma de baño. Incluye refrigerios, bebidas y zona de sombra. Ideal para niños, embarazadas y personas mayores. Capacidad 20 personas.",
        rating: "4.9 de 5.0",
        duration: ["6 horas"],
        capacity: "20 personas",
        ageRange: "Todas las edades",
        includes: ["Refrigerios", "Bebidas", "Zona de sombra", "Plataforma de baño", "Flotadores"],
        nearby: ["Laguna Bacalar - 0.5 km", "Punta Laguna - 5 km", "Pueblo mágico Bacalar - 2 km"],
    },
    {
        id: "snorkel",
        title: "Snorkel Subacuático",
        images: [velero5.src, velero2.src],
        schedule: "8:00 AM - 12:00 PM",
        price: "$550 MXN",
        text: "Descubre los arrecifes de coral y la vida marina tropical. Tour guiado por especialistas en snorkel con experiencia en seguridad acuática. Equipo completo, bebidas y snacks incluidos. Profundidad máxima 5 metros.",
        rating: "4.9 de 5.0",
        duration: ["4 horas"],
        capacity: "12 personas",
        ageRange: "Mayor de 8 años",
        includes: ["Equipo de snorkel completo", "Guía especializado", "Bebidas", "Snacks", "Chaleco salvavidas"],
        nearby: ["Arrecife de coral - 2 km", "Isla de pájaros - 5 km", "Centro de Bacalar - 3 km"],
    },
];