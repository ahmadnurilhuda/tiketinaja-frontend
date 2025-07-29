"use client";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteTicketType, getTicketType } from "./TicketTypeActions"; // Asumsi path ini benar
import { TicketType} from "@/types/TicketType"; // Asumsi path ini benar
import { Pencil, Trash2, Ticket as TicketIcon, Calendar, Box } from "lucide-react";
import { toast } from "react-toastify";

// Komponen untuk menampilkan skeleton saat loading
const TicketCardSkeleton = () => (
  <div className="border border-gray-200 rounded-lg p-4 animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
    <div className="h-8 bg-gray-300 rounded w-1/2 mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
  </div>
);

function OrganizerTicketType({ eventId, onEdit }: { eventId: string, onEdit: (ticketType: TicketType) => void }) {
  const { data: ticketTypes, isLoading, isError } = useQuery<TicketType[]>({
    queryKey: ["ticketTypes", eventId],
    queryFn: () => getTicketType(eventId),
    enabled: !!eventId,
  });

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteTicketType,
    onSuccess: () => {
      toast.success("Tiket berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ["ticketTypes", eventId] });
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const handleDelete = (ticketId : string) => {
    if (window.confirm("Anda yakin ingin menghapus tiket ini?")) {
      deleteMutation.mutate(ticketId);
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "Gratis";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(dateString));
  };
  const getStatusLabel = (startDateStr: string, endDateStr: string) => {
    const now = new Date();
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    if (now < startDate) {
      return (
        <span className="text-xs font-medium text-blue-800 bg-blue-100 px-2.5 py-1 rounded-full">
          Akan Datang
        </span>
      );
    } else if (now >= startDate && now <= endDate) {
      return (
        <span className="text-xs font-medium text-green-800 bg-green-100 px-2.5 py-1 rounded-full">
          Sedang Dijual
        </span>
      );
    } else {
      return (
        <span className="text-xs font-medium text-red-800 bg-red-100 px-2.5 py-1 rounded-full">
          Penjualan Berakhir
        </span>
      );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <TicketCardSkeleton />
        <TicketCardSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8 text-red-500 bg-red-50 rounded-lg">
        Gagal memuat data tiket.
      </div>
    );
  }

  if (Array.isArray(ticketTypes) && ticketTypes.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 border-2 border-dashed rounded-lg">
        <TicketIcon className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 font-semibold">Belum ada jenis tiket</p>
        <p className="text-sm">Tambahkan tiket baru melalui form di sebelah.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {(ticketTypes as TicketType[]).map((ticketType) => (
        <div key={ticketType.id} className="border border-gray-200 rounded-lg p-5 shadow-sm bg-white hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-gray-900">{ticketType.name}</h3>
              <p className="text-xl font-bold text-blue-600 mt-1">{formatPrice(ticketType.price)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => onEdit(ticketType)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full">
                <Pencil size={18} />
              </button>
              <button onClick={() => handleDelete(ticketType.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-full">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-3">{ticketType.description}</p>
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Box size={16} />
              <span>Stok: <span className="font-semibold text-gray-700">{ticketType.quantity}</span></span>
            </div>
            {getStatusLabel(ticketType.startDate, ticketType.endDate)}
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>Periode Jual: {formatDate(ticketType.startDate)} - {formatDate(ticketType.endDate)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default OrganizerTicketType;
