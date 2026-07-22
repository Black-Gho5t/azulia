// src/data/tours.ts
import type { ImageMetadata } from "astro";

// Importaciones de imágenes (se procesan correctamente a través de Vite en este archivo)
import velero2 from "../../../assets/photos_azulia_webp/velero/velero_2.webp";
import velero4 from "../../../assets/photos_azulia_webp/velero/velero_4.webp";
import velero5 from "../../../assets/photos_azulia_webp/velero/velero_5.webp";
import pontom from "../../../assets/photos_azulia_webp/ponton/pontom_8.webp";
import pontom2 from "../../../assets/photos_azulia_webp/ponton/pontom_2.webp";
import kayak from "../../../assets/photos_azulia_webp/Kayak/kayak (3).webp";
import paddle from "../../../assets/photos_azulia_webp/Paddle/paddle (4).webp";
import velero3 from "../../../assets/photos_azulia_webp/velero/velero_3.webp";
import velero6 from "../../../assets/photos_azulia_webp/velero/velero_6.webp";
import kayak1 from "../../../assets/photos_azulia_webp/Kayak/kayak (1).webp";
import kayak2 from "../../../assets/photos_azulia_webp/Kayak/kayak (2).webp";
import paddle1 from "../../../assets/photos_azulia_webp/Paddle/paddle (1).webp";
import paddle2 from "../../../assets/photos_azulia_webp/Paddle/paddle (2).webp";
import moto from "../../../assets/photos_azulia_webp/upscale_azulia_1.webp";
import moto2 from "../../../assets/photos_azulia_webp/upscale_azulia_2.webp";
import snorkel from "../../../assets/photos_azulia_webp/Mahahual/mahahual (2).webp";
import snorkel2 from "../../../assets/photos_azulia_webp/Mahahual/mahahual (4).webp";
import lancha from "../../../assets/photos_azulia_webp/velero/velero_8.webp";
import lancha2 from "../../../assets/photos_azulia_webp/ponton/pontom_3.webp";

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
        image: snorkel,
    },
    {
        id: "lancha",
        name: "Lancha",
        description: "Explora los arrecifes del sur de Mexico, decubre un nuevo mundo en el fondo de las aguas",
        icon: "directions_boat",
        image: lancha,
    },
    {
        id: "moto",
        name: "Moto acuatica",
        description: "Siente la adrenalina de conducir una increible moto acuatica por la laguna de bacalar y sus alrededores",
        icon: "snowmobile",
        image: moto
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
        images: [moto.src, moto2.src],
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
        images: [snorkel.src, snorkel2.src],
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
    {
        id: "kayak",
        title: "Kayak en Bacalar",
        images: [kayak1.src, kayak2.src],
        schedule: "6:00 AM - 10:00 AM - 4:00 PM",
        price: "$350 MXN",
        text: "Explora la Laguna de los 7 Colores desde una perspectiva única. Rema a través de aguas cristalinas rodeado de naturaleza virgen. Nuestros guías te llevarán por los mejores rincones de la laguna, incluyendo el famoso Canal de los Piratas y el Estrecho de los Sueños.",
        rating: "4.7 de 5.0",
        duration: ["Privado: 2 - 4 horas", "Colectivo: 2 horas"],
        capacity: "2 personas por kayak",
        ageRange: "Todas las edades",
        includes: ["Kayak doble o individual", "Remos", "Chaleco salvavidas", "Guía certificado", "Botella de agua"],
        nearby: ["Laguna Bacalar - 0 km", "Canal de los Piratas - 1 km", "Cenote de la Bruja - 3 km"],
    },
    {
        id: "paddle",
        title: "Paddle Board",
        images: [paddle1.src, paddle2.src],
        schedule: "6:00 AM - 10:00 AM - 4:00 PM",
        price: "$350 MXN",
        text: "Deslízate sobre las aguas cristalinas de Bacalar en una tabla de paddle board. Una actividad perfecta para conectar con la naturaleza mientras ejercitas tu equilibrio y fuerza central. Disfruta de amaneceres y atardeceres inolvidables desde el agua.",
        rating: "4.6 de 5.0",
        duration: ["Privado: 1 - 2 horas", "Colectivo: 1.5 horas"],
        capacity: "1 persona por tabla",
        ageRange: "Todas las edades",
        includes: ["Tabla de paddle board", "Remo", "Chaleco salvavidas", "Guía certificado", "Botella de agua"],
        nearby: ["Laguna Bacalar - 0 km", "Canal de los Piratas - 1 km", "Centro de Bacalar - 3 km"],
    },
    {
        id: "lancha",
        title: "Lancha Privada",
        images: [lancha.src, lancha2.src],
        schedule: "8:00 AM - 12:00 PM - 3:00 PM",
        price: "$600 MXN",
        text: "Recorre la Laguna de Bacalar a bordo de una lancha privada. Descubre rincones secretos, nada en aguas cristalinas y visita los puntos más emblemáticos como el Canal de los Piratas y la Isla de los Pájaros. Ideal para grupos que buscan una experiencia personalizada.",
        rating: "4.8 de 5.0",
        duration: ["Privado: 2 - 4 horas"],
        capacity: "6 personas",
        ageRange: "Todas las edades",
        includes: ["Lancha privada", "Capitán", "Bebidas", "Snacks", "Chalecos salvavidas", "Equipo de snorkel"],
        nearby: ["Laguna Bacalar - 0 km", "Canal de los Piratas - 1 km", "Isla de los Pájaros - 4 km", "Cenote de la Bruja - 3 km"],
    },
];