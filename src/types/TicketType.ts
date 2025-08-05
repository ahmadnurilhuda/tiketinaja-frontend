import { Event } from "./Event"

export type TicketType = {
    id: string,
    name: string,
    price: number,
    quantity: number,
    description: string,
    event : Event | null,
    startDate : string,
    endDate : string,
    createdAt: string,
    updatedAt: string
}

export interface TicketTypeData {
    id: string,
    name: string,
    price: number,
    quantity: number,
    description: string,
    event : Event | null,
    startDate : string,
    endDate : string,
    createdAt: string,
    updatedAt: string
}

export type TicketTypeRequest = {
    name: string,
    price: number,
    quantity: number,
    description: string,
    startDate: string,
    endDate: string
}