export interface TransportTypeOption {
    value: string;
    label: string;
}

export interface DeparturePoint {
    value: string;
    label: string;
}

export const nationalTransportTypes: TransportTypeOption[] = [
    { value: "taxi", label: "Taxi" },
    { value: "uber", label: "Uber" },
    { value: "privado", label: "Privado" },
    { value: "ado", label: "ADO" },
];

export const internationalTransportTypes: TransportTypeOption[] = [
    { value: "taxi", label: "Taxi" },
    { value: "uber", label: "Uber" },
    { value: "privado", label: "Privado" },
];

export const nationalDeparturePoints: DeparturePoint[] = [
    { value: "chetumal", label: "Chetumal" },
    { value: "bacalar", label: "Bacalar" },
    { value: "felipe-carrillo-puerto", label: "Felipe Carrillo Puerto" },
    { value: "tulum", label: "Tulum" },
    { value: "playa-del-carmen", label: "Playa del Carmen" },
    { value: "cancun", label: "Cancún" },
    { value: "merida", label: "Mérida" },
    { value: "campeche", label: "Campeche" },
];

export const internationalDeparturePoints: DeparturePoint[] = [
    ...nationalDeparturePoints,
    { value: "belice-city", label: "Belice City" },
    { value: "corozal", label: "Corozal" },
    { value: "san-pedro", label: "San Pedro" },
    { value: "flores", label: "Flores (Guatemala)" },
    { value: "peten", label: "Petén" },
    { value: "guatemala-city", label: "Ciudad de Guatemala" },
    { value: "san-pedro-sula", label: "San Pedro Sula" },
    { value: "la-ceiba", label: "La Ceiba" },
    { value: "tegucigalpa", label: "Tegucigalpa" },
];
