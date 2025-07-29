import React from "react";
import EventForm from "../../../components/EventForm";
import { getEvent, updateEvent } from "../../EventActions";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { id } = params; 
  const event = await getEvent(id);
  return {
    title: event ? `Edit Event: ${event.title}` : "Edit Event",
  };
}

async function page({ params }: { params: { id: string } }) {
  const { id } = params;
  const data = await getEvent(id);
  if (!data) {
    return <div>Event tidak ditemukan atau gagal dimuat.</div>;
  }
  const updateActionWithId = updateEvent.bind(null, id);

  return (
    <>
      <EventForm onFormSubmit={updateActionWithId} initialData={data} />
    </>
  );
}

export default page;
