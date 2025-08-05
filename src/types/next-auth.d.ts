import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      fullName: string;
      nickName: string;
      phoneNumber: string;
      email: string;
      role: string;
      verified: boolean;
      organizer: boolean;
    } & DefaultSession["user"];
    
    accessToken?: string;
  }

  interface User {
    id: string;
    fullName: string;
    nickName: string;
    phoneNumber: string;
    email: string;
    role: string;
    verified: boolean;
    organizer: boolean;
    accessToken?: string;
  }
}
