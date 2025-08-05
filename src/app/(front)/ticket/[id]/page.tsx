import React from "react";
import BuyerTicketDetail from "./BuyerTicketDetail";
import repository from "@/app/config/AxiosServerConfig";

const getTicket = async (id: string) => {
  try {
    const res = await repository.get(`/buyer/tickets/${id}`);
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

async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ticket = await getTicket(id);
  return (
    <>
      <BuyerTicketDetail ticket={ticket}></BuyerTicketDetail>
    </>
  );
}

export default page;
