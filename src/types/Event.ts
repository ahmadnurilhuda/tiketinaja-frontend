import { City } from "./City";
import { Category } from "./EventCategory";
import { Organizer } from "./Organizer";

export type Event = {
    id: string;
    title: string;
    slug: string;
    description: string;
    requirements: string;
    organizer: Organizer;
    startDate: string;
    endDate: string;
    posterUrl: string;
    venueLayoutUrl: string;
    venueName: string;
    venueAddress: string;
    city: City;
    eventCategory: Category;
    createdAt: string;
    updatedAt: string;
  };