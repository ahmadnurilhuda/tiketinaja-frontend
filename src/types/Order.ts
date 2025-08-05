import { User } from "next-auth";

export type Order = {
    id: string;
    eventId: string;
    user: User;
    totalAmount: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    meta: string;
};

export type OrderMetaItem = {
    eventId: string;
    eventSlug: string;
    eventTitle: string;
    eventStartDate: string;
    eventEndDate: string;
    eventPosterUrl: string;
    ticketTypeQuantity: number;
    ticketTypePrice: number;
    ticketTypeName: string;
    ticketTypeId: string;
};