import type { ImageMetadata } from "astro";

import nauticos from "../../../assets/photos_azulia_webp/velero/velero_6.webp"
import ruinas from "../../../assets/photos_azulia_webp/ruinas/Calakmul/calakmul (1).webp"
import mahahual_photo from "../../../assets/photos_azulia_webp/Mahahual/mahahual (7).webp"
import guatemala from "../../../assets/photos_azulia_webp/velero/velero_8.webp"
import belize from "../../../assets/photos_azulia_webp/Belize/Corozal/corozal__5.webp"

// Package images (not used elsewhere on this page)
import pkg_velero from "../../../assets/photos_azulia_webp/velero/velero_2.webp"
import pkg_calakmul from "../../../assets/photos_azulia_webp/ruinas/Calakmul/calakmul (2).webp"
import pkg_mahahual from "../../../assets/photos_azulia_webp/Mahahual/mahahual (5).webp"

// Collage images (unique, not repeated from above)
import collage_1 from "../../../assets/photos_azulia_webp/velero/velero_9.webp"
import collage_2 from "../../../assets/photos_azulia_webp/Mahahual/mahahual (2).webp"
import collage_3 from "../../../assets/photos_azulia_webp/Mahahual/mahahual (7).webp"
import collage_4 from "../../../assets/photos_azulia_webp/Mahahual/mahahual (4).webp"
import collage_5 from "../../../assets/photos_azulia_webp/Belize/Corozal/corozal__1.webp"
import collage_6 from "../../../assets/photos_azulia_webp/Belize/Corozal/corozal__2.webp"
import collage_7 from "../../../assets/photos_azulia_webp/ruinas/Calakmul/calakmul (3).webp"


export interface Tour {
    id: string;
    name: string;
    description: string;
    icon: string;
    image: ImageMetadata;
    link: string;
}

export interface PackageInclusion {
    icon: string;
    label: string;
}

export interface TourPackage {
    id: string;
    title: string;
    subtitle: string;
    image: ImageMetadata;
    price: number;
    currency: string;
    duration: string;
    groupSize: string;
    badge?: string;
    inclusions: PackageInclusion[];
    link: string;
}

export interface CollageImage {
    image: ImageMetadata;
    alt: string;
    span?: "tall" | "wide" | "normal";
}

export const tours: Tour[] = [
    {
        id: "nauticos",
        name: "Nauticos",
        description: "Vive la eventura en el agua con nuestros tours marítimos exclusivos. Explora el Caribe en barcos tradicionales.",
        icon: "anchor",
        image: nauticos,
        link: "/tours/nauticos"
    },
    {
        id: "ruinas",
        name: "Ruinas",
        description: "Descubre la riqueza histórica de las antiguas civilizaciones mayas. Visita templos y estructuras milenarias.",
        icon: "synagogue",
        image: ruinas,
        link: "/tours/ruinas"
    },
    {
        id: "mahahual",
        name: "Mahahual",
        description: "Playas vírgenes y arrecifes de coral con aguas cristalinas. Perfecto para snorkel y buceo.",
        icon: "directions_boat",
        image: mahahual_photo,
        link: "/tours/mahahual"
    },
    {
        id: "belice",
        name: "Belice",
        description: "Selva tropical, cayes de ensueño y aguas turquesas. La joya del Caribe para aventureros.",
        icon: "water_lux",
        image: belize,
        link: "/tours/belice"
    },
];

export const packages: TourPackage[] = [
    {
        id: "velero-bacalar",
        title: "Velero en Bacalar",
        subtitle: "Navega la Laguna de los 7 Colores a bordo de un velero privado",
        image: pkg_velero,
        price: 1800,
        currency: "MXN",
        duration: "8 horas",
        groupSize: "2 – 8 personas",
        badge: "Más popular",
        inclusions: [
            { icon: "restaurant", label: "Desayuno y comida" },
            { icon: "local_bar", label: "Bebidas ilimitadas" },
            { icon: "scuba_diving", label: "Equipo de snorkel" },
            { icon: "anchor", label: "Guía bilingüe" },
            { icon: "photo_camera", label: "Fotografías incluidas" },
        ],
        link: "/tours/nauticos#velero",
    },
    {
        id: "calakmul-selva",
        title: "Calakmul & Selva Maya",
        subtitle: "Adéntrate en la jungla y sube a la cima de la pirámide más alta de México",
        image: pkg_calakmul,
        price: 2400,
        currency: "MXN",
        duration: "12 horas",
        groupSize: "2 – 12 personas",
        inclusions: [
            { icon: "directions_bus", label: "Transporte privado" },
            { icon: "restaurant", label: "Almuerzo típico" },
            { icon: "synagogue", label: "Entrada a zona arqueológica" },
            { icon: "forest", label: "Guía arqueólogo" },
            { icon: "bug_report", label: "Repelente y equipo" },
        ],
        link: "/tours/ruinas#calakmul",
    },
    {
        id: "mahahual-arrecife",
        title: "Mahahual & Arrecife",
        subtitle: "Bucea en el segundo arrecife de coral más grande del mundo",
        image: pkg_mahahual,
        price: 1500,
        currency: "MXN",
        duration: "6 horas",
        groupSize: "2 – 10 personas",
        inclusions: [
            { icon: "scuba_diving", label: "Equipo de buceo" },
            { icon: "directions_boat", label: "Lancha rápida" },
            { icon: "lunch_dining", label: "Snack y frutas" },
            { icon: "local_bar", label: "Agua y refrescos" },
            { icon: "health_and_safety", label: "Seguro de actividad" },
        ],
        link: "/tours/mahahual#arrecife",
    },
];

export const collageImages: CollageImage[] = [
    { image: collage_1, alt: "Velero en el Caribe", span: "tall" },
    { image: collage_2, alt: "Playa de Mahahual", span: "normal" },
    { image: collage_3, alt: "Arrecife de coral", span: "wide" },
    { image: collage_4, alt: "Aguas turquesas", span: "normal" },
    { image: collage_5, alt: "Corozal, Belice", span: "normal" },
    { image: collage_6, alt: "Pueblo de Corozal", span: "tall" },
    { image: collage_7, alt: "Ruinas de Calakmul", span: "wide" },
];