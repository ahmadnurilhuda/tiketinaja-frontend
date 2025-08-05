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
    isOnline: boolean;
    city: City;
    eventCategory: Category;
    createdAt: string;
    updatedAt: string;
  };

  export type PublicEvent = {
    id: string;
    title: string;
    slug: string;
    description: string;
    requirements: string;
    organizerName: string;
    startDate: string;
    endDate: string;
    posterUrl: string;
    venueLayoutUrl: string;
    venueName: string;
    venueAddress: string;
    isOnline: boolean;
    city: string;
    eventCategory: string;
    createdAt: string;
    updatedAt: string;
  };

  export interface EventData {
    id: string;
    title: string;
    slug: string;
    description: string;
    requirements: string;
    venueName: string;
    venueAddress: string;
    organizer: Organizer;
    startDate: string;
    endDate: string;
    isOnline: boolean;
    posterUrl: string;
    venueLayoutUrl: string;
    city: City;
    eventCategory: Category;
    createdAt: string;
    updatedAt: string;
  }