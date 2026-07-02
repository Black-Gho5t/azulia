import type { ImageMetadata } from "astro";

import ichkabal2 from "../../../assets/photos_azulia_webp/ruinas/Ichkabal/ichkabal (2).webp";
import ichkabal3 from "../../../assets/photos_azulia_webp/ruinas/Ichkabal/ichkabal (3).webp";
import ichkabal4 from "../../../assets/photos_azulia_webp/ruinas/Ichkabal/ichkabal (4).webp";
import ichkabal5 from "../../../assets/photos_azulia_webp/ruinas/Ichkabal/ichkabal (5).webp";
import calakmul2 from "../../../assets/photos_azulia_webp/ruinas/Calakmul/calakmul (2).webp";
import calakmul3 from "../../../assets/photos_azulia_webp/ruinas/Calakmul/calakmul (3).webp";

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

export const guatemalaTours: Tour[] = [
    {
        id: "tikal",
        name: "Tikal",
        description: "Descubre el corazón del mundo maya en Tikal, la ciudad más grandiosa de la civilización maya, rodeada de selva tropical virgen.",
        icon: "account_balance",
        image: ichkabal2,
    },
    {
        id: "flores-peten",
        name: "Flores & Petén",
        description: "Recorre la encantadora isla de Flores en el lago Petén Itzá, una joya colonial rodeada de agua y cultura guatemalteca.",
        icon: "water",
        image: calakmul2,
    },
    {
        id: "semuc-champey",
        name: "Semuc Champey",
        description: "Sumérgete en las piscinas naturales de Semuc Champey, una maravilla escondida en las montañas de Alta Verapaz, Guatemala.",
        icon: "pool",
        image: ichkabal3,
    },
];

export const modalData: ModalData[] = [
    {
        id: "tikal",
        title: "Tikal, Guatemala",
        images: [ichkabal2.src, calakmul3.src],
        schedule: "4:00 AM - 10:00 PM",
        price: "$2,800 MXN",
        text: "Tikal es una de las ruinas mayas más impresionantes del mundo. Sus pirámides emergen por encima de la selva tropical de Petén. Camina entre jaguares, tucanes y monos araña mientras descubres los secretos de una civilización que dominó Mesoamérica por siglos. Incluye salida al amanecer.",
        rating: "5.0 de 5.0",
        duration: ["Tour completo: 18 horas"],
        capacity: "8 personas",
        ageRange: "Mayor de 8 años",
        includes: ["Transporte privado", "Cruce fronterizo asistido", "Entrada al parque nacional", "Guía arqueólogo", "Almuerzo típico", "Seguro de viaje"],
        nearby: ["Flores - 65 km", "Lago Petén Itzá - 60 km", "El Mirador - 75 km norte"],
    },
    {
        id: "flores-peten",
        title: "Flores & Lago Petén Itzá",
        images: [calakmul2.src, ichkabal4.src],
        schedule: "6:00 AM - 9:00 PM",
        price: "$1,600 MXN",
        text: "Flores es una pequeña isla colonial en el lago Petén Itzá con calles empedradas y casas de colores. Explora sus iglesias coloniales, navega por el lago y visita el Parque Natural Ixpanpajul para ver el atardecer desde las copas de los árboles.",
        rating: "4.7 de 5.0",
        duration: ["15 horas"],
        capacity: "10 personas",
        ageRange: "Todas las edades",
        includes: ["Transporte privado", "Cruce fronterizo", "Paseo en lancha", "Guía local", "Almuerzo"],
        nearby: ["Tikal - 65 km", "El Remate - 30 km", "Sayaxché - 60 km"],
    },
    {
        id: "semuc-champey",
        title: "Semuc Champey",
        images: [ichkabal3.src, ichkabal5.src],
        schedule: "5:00 AM - día siguiente",
        price: "$3,200 MXN",
        text: "Semuc Champey es una de las maravillas naturales más hermosas de Centroamérica. Un puente natural de roca caliza forma piscinas de agua turquesa sobre el río Cahabón. Ideal para nadar, explorar cuevas y conectar con la naturaleza más pura de Guatemala.",
        rating: "4.9 de 5.0",
        duration: ["Requiere 2 días / 1 noche"],
        capacity: "6 personas",
        ageRange: "Mayor de 10 años",
        includes: ["Transporte privado", "Alojamiento 1 noche", "Cruce fronterizo", "Guía local", "Comidas incluidas", "Equipo de espeleología"],
        nearby: ["Lanquín - 10 km", "Cobán - 65 km", "Grutas de Lanquín - 11 km"],
    },
];
