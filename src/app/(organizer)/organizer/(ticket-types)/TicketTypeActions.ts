"use server";
import repository from "@/app/config/AxiosServerConfig";
import { TicketType, TicketTypeRequest } from "@/types/TicketType";
import { AxiosError } from "axios";
import { revalidatePath } from "next/cache";

export async function getTicketType(eventId: string): Promise<TicketType[]> {
  try {
    const res = await repository.get(
      `/organizer/ticket-types/${eventId}/event`
    );
    if (res.status !== 200) {
      throw new Error(res.data.message || "Gagal mengambil jenis tiket");
    }
    return res.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createTicketType(
  eventId: string,
  values: TicketTypeRequest
) {
  try {
    const res = await repository.post("/organizer/ticket-types/create", {
      eventId,
      ...values,
    });
    if (res.status !== 200) {
      throw new Error(res.data.message || "Gagal membuat jenis tiket");
    }
    revalidatePath(`/organizer/events/${eventId}`);
    return {
      success: true,
      message: res.data.message || "Tiket berhasil dibuat",
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response && error.response.data) {
        const validationErrors = error.response.data.data;
        const firstErrorMessage =
          validationErrors?.[0]?.message || error.response.data.message;
        return {
          success: false,
          message: firstErrorMessage || "Terjadi kesalahan validasi.",
        };
      }
    }
    return {
      success: false,
      message: (error as Error).message || "Terjadi kesalahan pada server",
    };
  }
}

export async function updateTicketType(
  id: string,
  eventId: string,
  values: TicketTypeRequest
) {
  try {
    const res = await repository.put(`/organizer/ticket-types/update/${id}`, {
      eventId,
      ...values,
    });
    if (res.status !== 200) {
      throw new Error(res.data.message || "Gagal memperbarui jenis tiket");
    }
    revalidatePath(`/organizer/events/${eventId}`);
    return {
      success: true,
      message: res.data.message || "Jenis tiket berhasil diperbarui",
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response && error.response.data) {
        const validationErrors = error.response.data.data;
        const firstErrorMessage =
          validationErrors?.[0]?.message || error.response.data.message;
        return {
          success: false,
          message: firstErrorMessage || "Terjadi kesalahan validasi.",
        };
      }
    }

    return {
      success: false,
      message: (error as Error).message || "Terjadi kesalahan pada server",
    };
  }
}

export async function deleteTicketType(id: string) {
  try {
    const res = await repository.delete(`/organizer/ticket-types/delete/${id}`);
    if (res.status !== 200) {
      throw new Error(res.data.message || "Gagal menghapus jenis tiket");
    }
    return { success: true, message: "Jenis tiket berhasil dihapus" };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || "Terjadi kesalahan pada server",
    };
  }
}
