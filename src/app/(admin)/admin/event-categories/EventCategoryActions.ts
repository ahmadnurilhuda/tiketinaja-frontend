'use server'

import repository from '@/app/config/AxiosServerConfig'
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation'

export async function createEventCategory(data:{name:string, description:string}) {
  try {
    const res = await repository.post('/admin/event-categories/create', data)
    
    if (res.status !== 200 && res.status !== 201) {
      throw new Error(res.data.message || "Gagal membuat kategori");
    }
  } catch (error) {
    return { success: false, message: (error as Error).message || "Terjadi kesalahan pada server" };
  }

  redirect('/admin/event-categories');
}

export async function updateEventCategory(id : string, data:{name:string, description:string}) {
  try {
    const res = await repository.put(`/admin/event-categories/update/${id}`, data);
    if (res.status !== 200) {
      throw new Error(res.data.message || "Gagal memperbarui kategori");
    }
  } catch (error) {
    return { success: false, message: (error as Error).message || "Terjadi kesalahan pada server" };
  }
  redirect('/admin/event-categories');
}

export async function deleteEventCategory(id : string) {
  try {
    const res = await repository.delete(`/admin/event-categories/delete/${id}`);
    
    if (res.status !== 200) {
      // Jika gagal, kembalikan pesan error agar bisa ditangkap di client
      return { success: false, message: res.data.message || "Gagal menghapus kategori" };
    }
    // Jika berhasil, revalidasi path agar data di-refresh
    revalidatePath('/admin/event-categories');
    return { success: true, message: "Kategori berhasil dihapus" };
  } catch (error) {
    // Tangkap error jaringan atau lainnya
    return { success: false, message: (error as Error).message || "Terjadi kesalahan pada server" };
  }

}

