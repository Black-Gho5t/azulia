import type { ImageMetadata } from "astro";

import corozal1 from "../../../assets/photos_azulia_webp/Belize/Corozal/corozal__1.webp";
import corozal2 from "../../../assets/photos_azulia_webp/Belize/Corozal/corozal__2.webp";
import corozal3 from "../../../assets/photos_azulia_webp/Belize/Corozal/corozal__3.webp";
import corozal4 from "../../../assets/photos_azulia_webp/Belize/Corozal/corozal__4.webp";
import corozal5 from "../../../assets/photos_azulia_webp/Belize/Corozal/corozal__5.webp";

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

export const beliceTours: Tour[] = [
    {
        id: "corozal",
        name: "Corozal, Belice",
        description: "Cruza la frontera y descubre la encantadora ciudad caribeña de Corozal, con su rica herencia maya y costas relajantes.",
        icon: "flag",
        image: corozal1,
    },
    {
        id: "lamanai",
        name: "Ruinas de Lamanai",
        description: "Navega por el río Nuevo hasta las imponentes pirámides de Lamanai, rodeadas de selva tropical y fauna silvestre única.",
        icon: "account_balance",
        image: corozal2,
    },
    {
        id: "ambergris",
        name: "Ambergris Caye",
        description: "Visita la isla más grande de Belice, famosa por su arrecife de coral, aguas turquesas y el ambiente caribeño más auténtico.",
        icon: "beach_access",
        image: corozal3,
    },
];

export const modalData: ModalData[] = [
    {
        id: "corozal",
        title: "Excursión a Corozal",
        images: [corozal1.src, corozal5.src],
        schedule: "8:00 AM - 4:00 PM",
        price: "$800 MXN",
        text: "Descubre la magia de Corozal, una pintoresca ciudad fronteriza de Belice bañada por el Mar Caribe. Pasea por su mercado local, visita el sitio arqueológico de Cerros y disfruta de la gastronomía caribeña beliceña. A solo 45 minutos de Bacalar.",
        rating: "4.7 de 5.0",
        duration: ["Día completo: 8 horas"],
        capacity: "10 personas",
        ageRange: "Todas las edades",
        includes: ["Transporte privado", "Guía bilingüe", "Almuerzo típico", "Seguro de viaje"],
        nearby: ["Laguna Bacalar - 45 km", "Chetumal - 60 km", "Sitio Cerros - 5 km"],
    },
    {
        id: "lamanai",
        title: "Ruinas de Lamanai",
        images: [corozal2.src, corozal4.src],
        schedule: "7:00 AM - 6:00 PM",
        price: "$1,400 MXN",
        text: "Adéntrate en la selva beliceña y navega por el río Nuevo para llegar a Lamanai, una de las ciudades mayas más grandes y mejor conservadas. Sube al Templo Alto, observa cocodrilos en el río y escucha los monos saraguatos entre las copas de los árboles.",
        rating: "4.9 de 5.0",
        duration: ["Tour completo: 11 horas"],
        capacity: "8 personas",
        ageRange: "Mayor de 6 años",
        includes: ["Transporte privado", "Lancha fluvial", "Guía arqueólogo", "Almuerzo", "Entrada a zona arqueológica", "Binoculares"],
        nearby: ["New River Lagoon - en sitio", "Orange Walk Town - 40 km", "Corozal - 70 km"],
    },
    {
        id: "ambergris",
        title: "Ambergris Caye",
        images: [corozal3.src, corozal1.src],
        schedule: "6:00 AM - 7:00 PM",
        price: "$1,800 MXN",
        text: "Embárcate en una aventura a la isla caribeña más famosa de Belice. Practica snorkel en Hol Chan Marine Reserve, explora el pueblo de San Pedro a bordo de un golf cart y relájate en playas de arena blanca con palmeras. Una experiencia que no olvidarás.",
        rating: "4.8 de 5.0",
        duration: ["Día completo: 13 horas"],
        capacity: "6 personas",
        ageRange: "Mayor de 8 años",
        includes: ["Transporte a Chetumal", "Ferry a Ambergris", "Equipo de snorkel", "Almuerzo en isla", "Guía", "Seguro acuático"],
        nearby: ["Hol Chan Marine Reserve - 5 km", "Great Blue Hole - 60 km náuticos", "San Pedro Town - en sitio"],
    },
];
