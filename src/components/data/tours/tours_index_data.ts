import type { ImageMetadata } from "astro";

import nauticos from "../../../assets/photos_azulia_webp/velero/velero_6.webp"
import ruinas from "../../../assets/photos_azulia_webp/ruinas/Calakmul/calakmul (1).webp"
import mahahual_photo from "../../../assets/photos_azulia_webp/Mahahual/mahahual (7).webp"
import guatemala from "../../../assets/photos_azulia_webp/velero/velero_8.webp"
import belize from "../../../assets/photos_azulia_webp/Belize/Corozal/corozal__5.webp"


export interface Tour {
    id: string;
    name: string;
    description: string;
    icon: string;
    image: ImageMetadata;
    link: string;
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