import React from "react";
import EventForm from "../../components/EventForm";
import { createEvent } from "../EventActions";



function page() {

  return (
    <>
      <EventForm onFormSubmit={createEvent} />
    </>
  );
}

export default page;



//   const handleSubmit = async (formData: FormData) => {
//     const event: Event = {
//       title: formData.get("title") as string,
//       description: formData.get("description") as string,
//       requirements: formData.get("requirements") as string,
//       venueName: formData.get("venueName") as string,
//       venueAddress: formData.get("venueAddress") as string,
//       startDate: new Date(formData.get("startDate") as string),
//       endDate: new Date(formData.get("endDate") as string),
//       isOnline: formData.get("isOnline") === "true",
//       poster: null,
//       venueLayout: null,
//       cityId: formData.get("cityId") as string,
//       eventCategoryId: formData.get("eventCategoryId") as string,
//     };

//     const result = await createEvent(event);
//     if (result.success) {
//       return { error: undefined };
//     } else {
//       return { error: result.message };
//     }
//   };


// export interface Event {
//   title: string;
//   description: string;
//   requirements: string;
//   venueName: string;
//   venueAddress: string;
//   startDate: Date;
//   endDate: Date;
//   isOnline: boolean;
//   poster: null; // Add the poster property
//   venueLayout: null;
//   cityId: string;
//   eventCategoryId: string;
// }