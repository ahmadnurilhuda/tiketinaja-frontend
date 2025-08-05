import repository from "@/app/config/AxiosServerConfig";
import React from "react";
import EventCategoryForm from "../../../components/EventCategoryForm";
import { updateEventCategory } from "../../EventCategoryActions";

const getEventCategory = async (id:string) => {
  try {
    const response = await repository.get(`/admin/event-categories/${id}`);
    if (response.status !== 200) {
      throw new Error(response.data.message);
    }
    return response.data.data;
  } catch (error) {
    console.error(error);
  }
};

async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await getEventCategory(id);

  const updateActionWithId = updateEventCategory.bind(null, id);
  return <EventCategoryForm onFormSubmit={updateActionWithId} initialData={data} />;
}

export default page;
