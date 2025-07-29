"use server";

import repository from "@/app/config/AxiosServerConfig";
import { EventData } from "@/types/Event";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createEvent(formData: FormData): Promise<{ success: false; message: string } | void> {
  try {
    const res = await repository.post("/organizer/events/create", formData);
    if (res.status !== 200 && res.status !== 201) {
      throw new Error(res.data.message || "Gagal membuat event");
    }
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || "Terjadi kesalahan pada server",
    };
  }
  redirect("/organizer/event");
}

export async function deleteEvent(id: string) {
  try {
    const res = await repository.delete(`/organizer/events/delete/${id}`);
    if (res.status !== 200) {
      throw new Error(res.data.message || "Gagal menghapus event");
    }
    revalidatePath("/organizer/event");
    return { success: true, message: "Event berhasil dihapus" };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || "Terjadi kesalahan pada server",
    };
  }
}

export async function updateEvent(id: string, formData: FormData) : Promise<{ success: false; message: string } | void> {
  try {
    const res = await repository.put(
      `/organizer/events/update/${id}`,
      formData
    );
    if (res.status !== 200) {
      throw new Error(res.data.message || "Gagal memperbarui event");
    }
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || "Terjadi kesalahan pada server",
    };
  }
  redirect("/organizer/event");
}

export async function getEvent(id: string) : Promise<EventData | null> {
  try {
    const res = await repository.get(`/organizer/events/${id}`);
    if (res.status !== 200) {
      throw new Error(res.data.message || "Gagal mengambil event");
    }
    return res.data.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
