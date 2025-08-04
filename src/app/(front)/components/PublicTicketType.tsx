'use client'
import repository from '@/app/config/AxiosClientConfig';
import { TicketType } from '@/types/TicketType';
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Ticket, Calendar } from 'lucide-react';

// Komponen Skeleton untuk state loading
const TicketSkeleton = () => (
    <div className="border-2 border-gray-200 rounded-lg p-5 animate-pulse">
        <div className="flex justify-between items-center">
            <div className="h-7 bg-gray-300 rounded w-1/3"></div>
            <div className="h-8 bg-gray-300 rounded w-1/4"></div>
        </div>
        <div className="mt-4 h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mt-2"></div>
    </div>
);

function PublicTicketType({ eventId }: { eventId: string }) {
  const { data: ticketTypes, isLoading, isError } = useQuery({
    queryKey: ["publicTicketTypes", eventId],
    queryFn: async () => {
      try {
        const res = await repository.get(`/public/ticket-types/${eventId}/event`);
        if (res.status !== 200) {
          throw new Error(res.data.message || "Gagal mengambil jenis tiket");
        }
        return res.data.data; 
      } catch (error) {
        console.error(error);
        throw error; 
      }
    },
    enabled: !!eventId,
  });

  // Helper untuk format harga
  const formatPrice = (price: number) => {
    if (price === 0) return "Gratis";
    return new Intl.NumberFormat("id-ID", {
      style: "currency", currency: "IDR", minimumFractionDigits: 0,
    }).format(price);
  };

  // Helper untuk mendapatkan status penjualan
  const getSaleStatus = (startDateStr: string, endDateStr: string) => {
    const now = new Date();
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    if (now < startDate) return { text: "Segera Hadir", color: "blue", active: false };
    if (now > endDate) return { text: "Penjualan Berakhir", color: "red", active: false };
    return { text: "Tersedia", color: "green", active: true };
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <TicketSkeleton />
        <TicketSkeleton />
      </div>
    );
  }

  if (isError) {
    return <div className="text-center text-red-500 py-8">Gagal memuat jenis tiket.</div>;
  }

  if (!ticketTypes || ticketTypes.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12 border-2 border-dashed rounded-lg">
        <Ticket className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 font-semibold">Oops! Tiket belum tersedia.</p>
        <p className="text-sm">Silakan cek kembali nanti.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {ticketTypes.map((ticketType: TicketType) => {
        const status = getSaleStatus(ticketType.startDate, ticketType.endDate);

        return (
          <div key={ticketType.id} className={`border-2 rounded-xl p-6 transition-all ${status.active ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50 text-gray-400'}`}>
            <div className="flex flex-col md:flex-row justify-between md:items-center">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className={`text-xl font-bold ${status.active ? 'text-gray-900' : 'text-gray-500'}`}>{ticketType.name}</h3>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full bg-${status.color}-100 text-${status.color}-800`}>
                    {status.text}
                  </span>
                </div>
                <p className={`mt-1 text-sm ${status.active ? 'text-gray-600' : 'text-gray-400'}`}>{ticketType.description}</p>
              </div>
              <div className="mt-4 md:mt-0 md:ml-6 text-left md:text-right">
                <p className={`text-2xl font-extrabold ${status.active ? 'text-blue-600' : 'text-gray-500'}`}>{formatPrice(ticketType.price)}</p>
                <p className="text-xs text-gray-400">per tiket</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default PublicTicketType;
