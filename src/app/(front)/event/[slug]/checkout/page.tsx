import repository from "@/app/config/AxiosServerConfig";
import React from "react";
import PublicEventDetailCheckout from "./PublicEventDetailCheckout";

const getEvent = async (slug: string) => {
  try {
    const res = await repository.get(`/public/events/${slug}`);
    if (res.status !== 200) {
      throw new Error(res.data.message);
    }
    return res.data.data;
  } catch (error) {
    console.log(error);
    throw error instanceof Error
      ? error
      : new Error("Terjadi kesalahan tidak dikenal");
  }
};

async function page({ params }: { params: Promise < { slug: string } >}) {
  const { slug } = await params;
  const event = await getEvent(slug);
  return(
    <>
      <PublicEventDetailCheckout event={event} />
    </>
  );
}

export default page;
