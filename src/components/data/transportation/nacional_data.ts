export interface TransportOption {
    mode: string;
    icon: string;
    duration: string;
    frequency: string;
    estimatedPrice: string;
    notes: string;
}

export interface DestinationTransportInfo {
    schedule: string;
    nearestStop: string;
    distanceFromChetumal: string;
    distanceFromCancun: string;
    tips: string[];
    options: TransportOption[];
}

export interface NationalDestination {
    id: string;
    name: string;
    region: string;
    icon: string;
    shortDescription: string;
    highlight: string;
    image: string;
    gallery: string[];
    transport: DestinationTransportInfo;
}

export const nationalHeroImages: string[] = [
    "/src/assets/photos_azulia_webp/upscale_azulia_2.webp",
    "/src/assets/photos_azulia_webp/velero/velero_4.webp",
    "/src/assets/photos_azulia_webp/ponton/pontom_8.webp",
    "/src/assets/photos_azulia_webp/Belize/Corozal/corozal__5.webp",
];

export const nationalDestinations: NationalDestination[] = [
    {
        id: "chetumal",
        name: "Chetumal",
        region: "Quintana Roo",
        icon: "location_city",
        shortDescription: "Capital del estado y punto de salida principal para traslados regionales.",
        highlight: "Centro operativo del corredor",
        image: "/src/assets/photos_azulia_webp/Belize/Corozal/corozal__3.webp",
        gallery: [
            "/src/assets/photos_azulia_webp/Belize/Corozal/corozal__3.webp",
            "/src/assets/photos_azulia_webp/Belize/Corozal/corozal__4.webp",
        ],
        transport: {
            schedule: "Salidas desde 5:00 AM hasta 10:30 PM",
            nearestStop: "Terminal ADO Chetumal · Av. Insurgentes",
            distanceFromChetumal: "0 km",
            distanceFromCancun: "380 km",
            tips: [
                "Ideal para conectar con Bacalar, Mahahual y frontera sur.",
                "Reserva transportación privada para salidas antes de las 6:00 AM.",
            ],
            options: [
                {
                    mode: "ADO y líneas regionales",
                    icon: "directions_bus",
                    duration: "Variable por ruta",
                    frequency: "Cada 30-60 min",
                    estimatedPrice: "$120 - $1,050 MXN",
                    notes: "La opción con mejor cobertura en horarios durante todo el día.",
                },
                {
                    mode: "Traslado privado",
                    icon: "directions_car",
                    duration: "Flexible",
                    frequency: "Bajo reserva",
                    estimatedPrice: "$1,100+ MXN",
                    notes: "Recomendado para grupos o equipaje voluminoso.",
                },
            ],
        },
    },
    {
        id: "bacalar",
        name: "Bacalar",
        region: "Quintana Roo",
        icon: "waves",
        shortDescription: "Pueblo mágico y nodo turístico entre Chetumal y Tulum.",
        highlight: "Corazón del corredor Chetumal - Cancún",
        image: "/src/assets/photos_azulia_webp/upscale_azulia_1.webp",
        gallery: [
            "/src/assets/photos_azulia_webp/upscale_azulia_1.webp",
            "/src/assets/photos_azulia_webp/upscale_azulia_2.webp",
            "/src/assets/photos_azulia_webp/ponton/pontom_5.webp",
        ],
        transport: {
            schedule: "Servicio continuo de 5:30 AM a 11:00 PM",
            nearestStop: "Terminal ADO Bacalar · Centro",
            distanceFromChetumal: "40 km",
            distanceFromCancun: "340 km",
            tips: [
                "Para actividades tempranas en laguna, llega antes de 8:00 AM.",
                "Los taxis locales funcionan bien para tramos cortos en zona centro.",
            ],
            options: [
                {
                    mode: "ADO",
                    icon: "directions_bus",
                    duration: "40-50 min desde Chetumal",
                    frequency: "Cada 60 min",
                    estimatedPrice: "$70 - $130 MXN",
                    notes: "Económico y confiable para traslados cotidianos.",
                },
                {
                    mode: "Taxi autorizado",
                    icon: "local_taxi",
                    duration: "35-45 min",
                    frequency: "24/7",
                    estimatedPrice: "$550 - $850 MXN",
                    notes: "Más práctico para llegar directo a hoteles de la costera.",
                },
                {
                    mode: "Privado ejecutivo",
                    icon: "verified_user",
                    duration: "35-40 min",
                    frequency: "Bajo reserva",
                    estimatedPrice: "$900 - $1,400 MXN",
                    notes: "Incluye espera en aeropuerto o terminal, ideal para familias.",
                },
            ],
        },
    },
    {
        id: "felipe-carrillo-puerto",
        name: "Felipe Carrillo Puerto",
        region: "Quintana Roo",
        icon: "forest",
        shortDescription: "Conexión estratégica entre la zona maya y la ruta costera.",
        highlight: "Conecta ruinas y costa",
        image: "/src/assets/photos_azulia_webp/ruinas/Ichkabal/ichkabal (4).webp",
        gallery: [
            "/src/assets/photos_azulia_webp/ruinas/Ichkabal/ichkabal (4).webp",
            "/src/assets/photos_azulia_webp/ruinas/Ichkabal/ichkabal (5).webp",
        ],
        transport: {
            schedule: "Operación de 6:00 AM a 9:30 PM",
            nearestStop: "Terminal Centro FCP",
            distanceFromChetumal: "170 km",
            distanceFromCancun: "220 km",
            tips: [
                "Punto ideal para conectar con comunidades mayas y rutas rurales.",
                "Consulta clima en temporada de lluvias para rutas secundarias.",
            ],
            options: [
                {
                    mode: "ADO / Mayab",
                    icon: "directions_bus",
                    duration: "2 h 20 min desde Chetumal",
                    frequency: "Cada 2 h",
                    estimatedPrice: "$220 - $330 MXN",
                    notes: "La opción más estable para viajeros independientes.",
                },
                {
                    mode: "Shuttle compartido",
                    icon: "groups",
                    duration: "2 h",
                    frequency: "4 a 6 salidas diarias",
                    estimatedPrice: "$280 - $420 MXN",
                    notes: "Buena relación costo/tiempo para moverte entre destinos turísticos.",
                },
            ],
        },
    },
    {
        id: "tulum",
        name: "Tulum",
        region: "Quintana Roo",
        icon: "beach_access",
        shortDescription: "Destino clave de la Riviera Maya con acceso rápido a costa y arqueología.",
        highlight: "Alta conectividad turística",
        image: "/src/assets/photos_azulia_webp/mahahual/mahahual (2).webp",
        gallery: [
            "/src/assets/photos_azulia_webp/mahahual/mahahual (2).webp",
            "/src/assets/photos_azulia_webp/mahahual/mahahual (4).webp",
        ],
        transport: {
            schedule: "Traslados de 5:00 AM a 11:30 PM",
            nearestStop: "Terminal ADO Tulum",
            distanceFromChetumal: "250 km",
            distanceFromCancun: "130 km",
            tips: [
                "Si vas a zona hotelera, considera última milla en taxi autorizado.",
                "En temporada alta conviene reservar con 24 h de anticipación.",
            ],
            options: [
                {
                    mode: "ADO",
                    icon: "directions_bus",
                    duration: "3 h 20 min desde Chetumal",
                    frequency: "Cada 60-90 min",
                    estimatedPrice: "$390 - $580 MXN",
                    notes: "Conexión directa con terminal céntrica.",
                },
                {
                    mode: "Traslado privado",
                    icon: "directions_car",
                    duration: "2 h 50 min",
                    frequency: "Bajo reserva",
                    estimatedPrice: "$2,800 - $4,500 MXN",
                    notes: "Ideal para grupos, evita escalas y espera.",
                },
                {
                    mode: "Uber (zonas habilitadas)",
                    icon: "local_shipping",
                    duration: "Variable",
                    frequency: "Sujeto a disponibilidad",
                    estimatedPrice: "$320 - $900 MXN",
                    notes: "Funciona en tramos urbanos, no siempre en terminales.",
                },
            ],
        },
    },
    {
        id: "playa-del-carmen",
        name: "Playa del Carmen",
        region: "Quintana Roo",
        icon: "wb_sunny",
        shortDescription: "Hub central de movilidad para conectar con toda la Riviera y Yucatán.",
        highlight: "Centro logístico Riviera Maya",
        image: "/src/assets/photos_azulia_webp/ponton/pontom_2.webp",
        gallery: [
            "/src/assets/photos_azulia_webp/ponton/pontom_2.webp",
            "/src/assets/photos_azulia_webp/ponton/pontom_4.webp",
        ],
        transport: {
            schedule: "Disponibilidad de 4:30 AM a medianoche",
            nearestStop: "Terminal Turística y Terminal Alterna ADO",
            distanceFromChetumal: "310 km",
            distanceFromCancun: "70 km",
            tips: [
                "Punto ideal para cambiar de línea hacia Yucatán y Campeche.",
                "Para ferry a Cozumel, considera mínimo 40 min de margen.",
            ],
            options: [
                {
                    mode: "ADO",
                    icon: "directions_bus",
                    duration: "4 h 20 min desde Chetumal",
                    frequency: "Cada 45-60 min",
                    estimatedPrice: "$480 - $700 MXN",
                    notes: "Servicio frecuente todo el día.",
                },
                {
                    mode: "Privado puerta a puerta",
                    icon: "verified_user",
                    duration: "3 h 40 min",
                    frequency: "Bajo reserva",
                    estimatedPrice: "$3,200 - $5,000 MXN",
                    notes: "Cómodo para familias y grupos corporativos.",
                },
            ],
        },
    },
    {
        id: "cancun",
        name: "Cancún",
        region: "Quintana Roo",
        icon: "flight_takeoff",
        shortDescription: "Principal puerta aérea del Caribe mexicano y extremo norte del corredor.",
        highlight: "Conexión aeropuerto internacional",
        image: "/src/assets/photos_azulia_webp/velero/velero_6.webp",
        gallery: [
            "/src/assets/photos_azulia_webp/velero/velero_6.webp",
            "/src/assets/photos_azulia_webp/velero/velero_3.webp",
        ],
        transport: {
            schedule: "Operación 24 h según ruta",
            nearestStop: "AICM Cancún T2/T3 + Terminal ADO Centro",
            distanceFromChetumal: "380 km",
            distanceFromCancun: "0 km",
            tips: [
                "Programa salida con 4-5 horas de margen si conectas con vuelo.",
                "Hay opciones directas desde Bacalar y Tulum durante el día.",
            ],
            options: [
                {
                    mode: "ADO",
                    icon: "directions_bus",
                    duration: "5 h 10 min desde Chetumal",
                    frequency: "Cada 45-90 min",
                    estimatedPrice: "$560 - $820 MXN",
                    notes: "Conexión directa a aeropuerto en salidas específicas.",
                },
                {
                    mode: "Privado ejecutivo",
                    icon: "directions_car",
                    duration: "4 h 30 min",
                    frequency: "Bajo reserva",
                    estimatedPrice: "$4,200 - $6,500 MXN",
                    notes: "Recomendado para itinerarios con vuelo y equipaje especial.",
                },
            ],
        },
    },
    {
        id: "chichen-itza",
        name: "Chichén Itzá",
        region: "Yucatán",
        icon: "temple_hindu",
        shortDescription: "Zona arqueológica icónica de Yucatán accesible desde el corredor turístico.",
        highlight: "Ruinas cercanas al eje turístico",
        image: "/src/assets/photos_azulia_webp/ruinas/Calakmul/calakmul (1).webp",
        gallery: [
            "/src/assets/photos_azulia_webp/ruinas/Calakmul/calakmul (1).webp",
            "/src/assets/photos_azulia_webp/ruinas/Ichkabal/ichkabal (3).webp",
        ],
        transport: {
            schedule: "Tours y salidas desde 5:00 AM",
            nearestStop: "Terminal Pisté / Parador turístico",
            distanceFromChetumal: "315 km",
            distanceFromCancun: "200 km",
            tips: [
                "Salida temprana recomendada para evitar calor y filas.",
                "Puede combinarse con Valladolid o cenotes cercanos.",
            ],
            options: [
                {
                    mode: "Bus turístico",
                    icon: "directions_bus",
                    duration: "4 h 40 min desde Chetumal",
                    frequency: "2 a 4 salidas diarias",
                    estimatedPrice: "$650 - $980 MXN",
                    notes: "Incluye paradas en puntos estratégicos.",
                },
                {
                    mode: "Privado",
                    icon: "verified_user",
                    duration: "4 h",
                    frequency: "Bajo reserva",
                    estimatedPrice: "$4,800 - $7,200 MXN",
                    notes: "Ideal si deseas visitar más de una ruina el mismo día.",
                },
            ],
        },
    },
    {
        id: "calakmul",
        name: "Calakmul",
        region: "Campeche",
        icon: "landscape",
        shortDescription: "Reserva de la biosfera y una de las ruinas mayas más impresionantes del sureste.",
        highlight: "Ruina principal cercana a Bacalar",
        image: "/src/assets/photos_azulia_webp/ruinas/Calakmul/calakmul (2).webp",
        gallery: [
            "/src/assets/photos_azulia_webp/ruinas/Calakmul/calakmul (2).webp",
            "/src/assets/photos_azulia_webp/ruinas/Calakmul/calakmul (3).webp",
        ],
        transport: {
            schedule: "Operación sugerida desde 4:30 AM",
            nearestStop: "Conhuas / Zona arqueológica de Calakmul",
            distanceFromChetumal: "280 km",
            distanceFromCancun: "540 km",
            tips: [
                "La zona final requiere tramo carretero rural; mejor en privado.",
                "Recomendado combinar con estancia nocturna por distancia.",
            ],
            options: [
                {
                    mode: "Mixto bus + transfer",
                    icon: "alt_route",
                    duration: "6 h 30 min desde Chetumal",
                    frequency: "1 a 2 salidas diarias",
                    estimatedPrice: "$900 - $1,450 MXN",
                    notes: "Requiere coordinación de horarios en conexión final.",
                },
                {
                    mode: "Privado 4x4",
                    icon: "directions_car",
                    duration: "5 h 10 min",
                    frequency: "Bajo reserva",
                    estimatedPrice: "$6,500 - $9,200 MXN",
                    notes: "Opción más segura y eficiente para llegar temprano.",
                },
            ],
        },
    },
    {
        id: "edzna",
        name: "Edzná",
        region: "Campeche",
        icon: "account_balance",
        shortDescription: "Ruinas mayas de Campeche conectadas por rutas terrestres desde Quintana Roo.",
        highlight: "Conexión histórica en Campeche",
        image: "/src/assets/photos_azulia_webp/ruinas/Ichkabal/ichkabal (1).webp",
        gallery: [
            "/src/assets/photos_azulia_webp/ruinas/Ichkabal/ichkabal (1).webp",
            "/src/assets/photos_azulia_webp/ruinas/Ichkabal/ichkabal (2).webp",
        ],
        transport: {
            schedule: "Salidas sugeridas de 5:00 AM a 6:00 AM",
            nearestStop: "Ciudad de Campeche + transfer a zona arqueológica",
            distanceFromChetumal: "460 km",
            distanceFromCancun: "480 km",
            tips: [
                "Conviene ruta con pernocta o salida muy temprana.",
                "Puede combinarse con visita al centro histórico de Campeche.",
            ],
            options: [
                {
                    mode: "Bus interurbano + transfer",
                    icon: "directions_bus",
                    duration: "7 h 30 min desde Chetumal",
                    frequency: "1 salida principal diaria",
                    estimatedPrice: "$1,000 - $1,650 MXN",
                    notes: "Planifica conexión en Campeche para llegar sin contratiempos.",
                },
                {
                    mode: "Privado multi-destino",
                    icon: "verified_user",
                    duration: "6 h 40 min",
                    frequency: "Bajo reserva",
                    estimatedPrice: "$7,200 - $10,500 MXN",
                    notes: "Excelente para itinerarios arqueológicos largos.",
                },
            ],
        },
    },
];
