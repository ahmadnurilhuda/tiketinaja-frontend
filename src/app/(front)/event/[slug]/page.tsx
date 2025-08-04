import React from "react";
import PublicEventDetail from "./PublicEventDetail";
import repository from "@/app/config/AxiosServerConfig";
import type { PublicEvent } from "@/types/Event";

const getEvent = async (slug: string) : Promise<PublicEvent> => {
    try{
        const res = await repository.get(`/public/events/${slug}`);
        if(res.status !== 200){
            throw new Error(res.data.message);
        }
        return res.data.data;
    }catch(err){
        console.log(err);
        throw err instanceof Error
        ? err
        : new Error("Terjadi kesalahan tidak dikenal");
    }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = params; 
  const event = await getEvent(slug);
  return {
    title: event ? `${event.title}` : "Event",
  };
}

async function page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const event = await getEvent(slug);
  return (
    <>
      <PublicEventDetail event={event} />
    </>
  );
}

export default page;
