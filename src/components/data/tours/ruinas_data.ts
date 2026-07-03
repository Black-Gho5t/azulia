// src/data/tours.ts
import type { ImageMetadata } from "astro";

// Importaciones de imágenes (se procesan correctamente a través de Vite en este archivo)
import calakmul from "../../../assets/photos_azulia_webp/ruinas/Calakmul/calakmul (1).webp";
import ichkabal from "../../../assets/photos_azulia_webp/ruinas/Ichkabal/ichkabal (1).webp"


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

export const ruinasTours: Tour[] = [
    {
        id: "ichkabal",
        name: "Ichkabal",
        description: "Adentrate en las antiguas piramides de las ruinas de Ichkabal",
        icon: "account_balance",
        image: ichkabal,
    },
    {
        id: "calakmul",
        name: "Calakmul",
        description: "Admira la fauna silvestre de las ruinas de Calakmul, observa los rastros de una antigua civilizacion",
        icon: "history_edu",
        image: calakmul,
    },
];

export const modalData: ModalData[] = [
    {
        id: "ichkabal",
        title: "Ruinas de Ichkabal",
        images: [ichkabal.src, calakmul.src],
        schedule: "8:00 AM - 11:00 AM - 3:00 PM",
        price: "$900 MXN",
        text: "Ichkabal, cerca de la laguna de Bacalar se encuentra una cieudad antigua, mas antigua que Chichen Itza y Uxmal. Explora la belleza de un mundo antiguo!",
        rating: "4.8 de 5.0",
        duration: ["Privado: 3 - 5 horas", "Colectivo: 3 horas"],
        capacity: "12 personas",
        ageRange: "Todas las edades",
        includes: ["Snacks", "Bebidas", "Visita guiada"],
        nearby: ["Laguna Bacalar - 2 km", "Fuerte de San Felipe - 8 km", "Centro de Bacalar - 3 km"],
    },
    {
        id: "calakmul",
        title: "Ruinas de Calakmul",
        images: [calakmul.src, ichkabal.src],
        schedule: "9:00 AM - 12:00 PM - 4:00 PM",
        price: "$1,800 MXN",
        text: "Viaja en el tiempo y conquista la cumbre del imperio antiguo más imponente, donde la majestuosidad de la historia milenaria se funde con la naturaleza indomable. Camina entre pirámides sagradas, escucha el rugido del jaguar y despierta tu espíritu aventurero.",
        rating: "4.7 de 5.0",
        duration: ["Privado: 3 - 5 horas", "Colectivo: 3 horas"],
        capacity: "12 personas",
        ageRange: "Mayor de 6 años",
        includes: ["Snacks", "Bebidas", "Visita guiada"],
        nearby: ["Laguna Bacalar - 1 km", "Cenotes cercanos - 15 km", "Playas vírgenes - 10 km"],
    },
];