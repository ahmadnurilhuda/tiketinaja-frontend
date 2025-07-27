import { User } from "next-auth";

export type Organizer = {
    id: number;
    user: User;
    name: string;
    phoneNumber: string;
    websiteUrl: string;
    profilePictureUrl: string;
    biography: string;
    email: string;
    created_at: string;
    updated_at: string;
    deleted_at: string;
};