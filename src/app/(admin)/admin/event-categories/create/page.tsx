import React from "react";
import EventCategoryForm from "../../components/EventCategoryForm";
import { createEventCategory } from "../EventCategoryActions";

function page() {
  return (
      <EventCategoryForm onFormSubmit={createEventCategory} />
  );
}
export default page;
