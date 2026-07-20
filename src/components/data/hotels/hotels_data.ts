export interface HotelPerk {
    icon: string;
    label: string;
}

export interface HotelEntry {
    id: string;
    name: string;
    zone: string;
    price: number;
    score: number;
    description: string;
    image: string;
    perks: HotelPerk[];
}

export const hotelsData: HotelEntry[] = [
    {
        id: "casa-siete-colores-boutique",
        name: "Casa Siete Colores Boutique",
        zone: "Costera de Bacalar",
        price: 3250,
        score: 4.9,
        description: "Suites boutique frente a la laguna, muelle privado y desayuno artesanal incluido.",
        image: "/src/assets/photos_azulia_webp/ponton/pontom_8.webp",
        perks: [
            { icon: "water", label: "Vista laguna" },
            { icon: "free_breakfast", label: "Desayuno" },
            { icon: "spa", label: "Spa" },
        ],
    },
    {
        id: "laguna-brisa-eco-lodge",
        name: "Laguna Brisa Eco Lodge",
        zone: "Ejidal Bacalar",
        price: 1890,
        score: 4.7,
        description: "Hospedaje eco-chic rodeado de naturaleza con actividades de kayak y zona de fogata nocturna.",
        image: "/src/assets/photos_azulia_webp/upscale_azulia_1.webp",
        perks: [
            { icon: "park", label: "Naturaleza" },
            { icon: "kayaking", label: "Kayak" },
            { icon: "local_fire_department", label: "Fogata" },
        ],
    },
    {
        id: "mirador-del-caribe-hotel",
        name: "Mirador del Caribe Hotel",
        zone: "Centro Histórico",
        price: 2490,
        score: 4.8,
        description: "Habitaciones premium con rooftop, cocteleria al atardecer y traslados a puntos clave.",
        image: "/src/assets/photos_azulia_webp/velero/velero_4.webp",
        perks: [
            { icon: "roofing", label: "Rooftop" },
            { icon: "airport_shuttle", label: "Traslados" },
            { icon: "local_bar", label: "Cocteleria" },
        ],
    },
    {
        id: "mar-de-jade-family-resort",
        name: "Mar de Jade Family Resort",
        zone: "Avenida Costera Norte",
        price: 2790,
        score: 4.6,
        description: "Ideal para familias, con club infantil, alberca y paquetes de tours personalizados.",
        image: "/src/assets/photos_azulia_webp/velero/velero_5.webp",
        perks: [
            { icon: "pool", label: "Alberca" },
            { icon: "child_care", label: "Club infantil" },
            { icon: "travel_explore", label: "Tours" },
        ],
    },
    {
        id: "azul-vela-signature-stay",
        name: "Azul Vela Signature Stay",
        zone: "Canal de los Piratas",
        price: 3590,
        score: 5.0,
        description: "Concepto adults only con experiencias privadas en velero y cenas romanticas junto al agua.",
        image: "/src/assets/photos_azulia_webp/velero/velero_3.webp",
        perks: [
            { icon: "sailing", label: "Velero privado" },
            { icon: "restaurant", label: "Cena gourmet" },
            { icon: "king_bed", label: "Suite premium" },
        ],
    },
    {
        id: "coralina-house-suites",
        name: "Coralina House & Suites",
        zone: "Barrio Mágico",
        price: 2140,
        score: 4.5,
        description: "Suites amplias para estancias largas, coworking y excelente ubicacion para explorar Bacalar.",
        image: "/src/assets/photos_azulia_webp/ponton/pontom_2.webp",
        perks: [
            { icon: "wifi", label: "Wifi rápido" },
            { icon: "luggage", label: "Estancias largas" },
            { icon: "pin_drop", label: "Ubicación top" },
        ],
    },
];
