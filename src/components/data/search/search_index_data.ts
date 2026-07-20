import { hotelsData } from "../hotels/hotels_data";
import { carRentalFleet } from "../transportation/car_rental_data";
import { internationalDestinations } from "../transportation/international_data";
import { nationalDestinations } from "../transportation/nacional_data";
import {
    modalData as beliceModals,
    beliceTours,
} from "../tours/belice_data";
import {
    modalData as guatemalaModals,
    guatemalaTours,
} from "../tours/guatemala_data";
import {
    modalData as hondurasModals,
    hondurasTours,
} from "../tours/honduras_data";
import {
    modalData as mahahualModals,
    mahahualTours,
} from "../tours/mahahual_data";
import {
    modalData as nauticosModals,
    nauticosTours,
} from "../tours/nauticos_data";
import {
    modalData as ruinasModals,
    ruinasTours,
} from "../tours/ruinas_data";
import {
    collageImages,
    packages,
    tours,
} from "../tours/tours_index_data";

export interface SearchCardItem {
    id: string;
    area: string;
    title: string;
    description: string;
    image: string;
    href: string;
    keywords: string[];
}

export interface SearchPhotoItem {
    id: string;
    area: string;
    title: string;
    description: string;
    image: string;
    href: string;
}

const tourCollections = [
    {
        area: "Tours Náuticos",
        hrefBase: "/tours/nauticos",
        tours: nauticosTours,
        modals: nauticosModals,
    },
    {
        area: "Tours Ruinas",
        hrefBase: "/tours/ruinas",
        tours: ruinasTours,
        modals: ruinasModals,
    },
    {
        area: "Tours Mahahual",
        hrefBase: "/tours/mahahual",
        tours: mahahualTours,
        modals: mahahualModals,
    },
    {
        area: "Tours Belice",
        hrefBase: "/tours/belice",
        tours: beliceTours,
        modals: beliceModals,
    },
    {
        area: "Tours Guatemala",
        hrefBase: "/tours/guatemala",
        tours: guatemalaTours,
        modals: guatemalaModals,
    },
    {
        area: "Tours Honduras",
        hrefBase: "/tours/honduras",
        tours: hondurasTours,
        modals: hondurasModals,
    },
];

const cards: SearchCardItem[] = [
    ...tours.map((tour) => ({
        id: `tour-index-${tour.id}`,
        area: "Tours",
        title: tour.name,
        description: tour.description,
            image: tour?.image?.src ?? "",
        href: tour.link,
        keywords: [tour.icon, "tour", "paquete", "caribe", "bacalar"],
    })),
    ...packages.map((pkg) => ({
        id: `tour-package-${pkg.id}`,
        area: "Tours Paquetes",
        title: pkg.title,
        description: `${pkg.subtitle}. Duración: ${pkg.duration}. Grupo: ${pkg.groupSize}.`,
        image: pkg?.image?.src ?? "",
        href: pkg.link,
        keywords: ["paquete", "oferta", ...pkg.inclusions.map((inc) => inc.label)],
    })),
    ...tourCollections.flatMap((collection) => [
        ...collection.tours.map((tour) => ({
            id: `${collection.hrefBase}-tour-${tour.id}`,
            area: collection.area,
            title: tour.name,
            description: tour.description,
        image: tour?.image?.src ?? "",
            href: `${collection.hrefBase}#${tour.id}`,
            keywords: [tour.icon, "tour", collection.area],
        })),
        ...collection.modals.map((modal) => ({
            id: `${collection.hrefBase}-modal-${modal.id}`,
            area: `${collection.area} · Detalles`,
            title: modal.title,
            description: `${modal.text} Horario: ${modal.schedule}. Precio: ${modal.price}.`,
            image: modal.images[0],
            href: `${collection.hrefBase}#${modal.id}`,
            keywords: [
                "modal",
                modal.schedule,
                modal.price,
                ...(modal.includes ?? []),
                ...(modal.nearby ?? []),
            ],
        })),
    ]),
    ...hotelsData.map((hotel) => ({
        id: `hotel-${hotel.id}`,
        area: "Hoteles",
        title: hotel.name,
        description: `${hotel.description} Zona: ${hotel.zone}.`,
        image: hotel.image,
        href: "/hotels/hoteles_index",
        keywords: [
            "hotel",
            hotel.zone,
            ...hotel.perks.map((perk) => perk.label),
            `precio ${hotel.price}`,
        ],
    })),
    ...nationalDestinations.map((destination) => ({
        id: `transport-nacional-${destination.id}`,
        area: "Transportación Nacional",
        title: destination.name,
        description: destination.shortDescription,
        image: destination.image,
        href: "/transportation/nacional",
        keywords: [destination.region, destination.highlight, ...destination.transport.tips],
    })),
    ...internationalDestinations.map((destination) => ({
        id: `transport-internacional-${destination.id}`,
        area: "Transportación Internacional",
        title: destination.name,
        description: destination.shortDescription,
        image: destination.image,
        href: "/transportation/international",
        keywords: [destination.region, destination.highlight, ...destination.transport.tips],
    })),
    ...carRentalFleet.map((car) => ({
        id: `renta-autos-${car.id}`,
        area: "Renta de autos",
        title: `${car.model} ${car.year}`,
        description: `${car.shortDescription} ${car.type}. ${car.transmission}.`,
        image: car.images[0],
        href: "/transportation/renta-autos",
        keywords: [
            car.type,
            car.transmission,
            car.engine,
            car.fuel,
            car.drivetrain,
            ...car.features,
        ],
    })),
];

const photos: SearchPhotoItem[] = [
    ...collageImages.map((item, index) => ({
        id: `galeria-tour-${index + 1}`,
        area: "Galería Tours",
        title: item.alt,
        description: item.alt,
        image: item.image.src,
        href: "/tours/tours_index#galeria",
    })),
    ...tourCollections.flatMap((collection) =>
        collection.modals.flatMap((modal) =>
            modal.images.map((image, imageIndex) => ({
                id: `${collection.hrefBase}-photo-${modal.id}-${imageIndex + 1}`,
                area: `${collection.area} · Fotos`,
                title: `${modal.title} · Foto ${imageIndex + 1}`,
                description: modal.text,
                image,
                href: `${collection.hrefBase}#${modal.id}`,
            })),
        ),
    ),
    ...hotelsData.map((hotel) => ({
        id: `hotel-photo-${hotel.id}`,
        area: "Hoteles · Fotos",
        title: hotel.name,
        description: hotel.description,
        image: hotel.image,
        href: "/hotels/hoteles_index",
    })),
    ...nationalDestinations.flatMap((destination, index) =>
        destination.gallery.map((image, imageIndex) => ({
            id: `national-photo-${destination.id}-${index}-${imageIndex}`,
            area: "Transportación Nacional · Fotos",
            title: destination.name,
            description: destination.shortDescription,
            image,
            href: "/transportation/nacional",
        })),
    ),
    ...internationalDestinations.flatMap((destination, index) =>
        destination.gallery.map((image, imageIndex) => ({
            id: `international-photo-${destination.id}-${index}-${imageIndex}`,
            area: "Transportación Internacional · Fotos",
            title: destination.name,
            description: destination.shortDescription,
            image,
            href: "/transportation/international",
        })),
    ),
    ...carRentalFleet.flatMap((car) =>
        car.images.map((image, imageIndex) => ({
            id: `car-photo-${car.id}-${imageIndex + 1}`,
            area: "Renta de autos · Fotos",
            title: `${car.model} ${car.year}`,
            description: car.shortDescription,
            image,
            href: "/transportation/renta-autos",
        })),
    ),
];

export const searchableCards: SearchCardItem[] = cards;
export const searchablePhotos: SearchPhotoItem[] = photos;
