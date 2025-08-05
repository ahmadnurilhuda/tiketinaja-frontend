'use client'
import repository from '@/app/config/AxiosClientConfig'
import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import { PaginationState } from '@tanstack/react-table'
import { ChevronLeft, ChevronRight, QrCode, Calendar, Ticket } from 'lucide-react'
import Image from 'next/image'
import type { TicketType } from '@/types/Ticket'
import Link from 'next/link'


// Komponen Skeleton untuk state loading
const TicketCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg flex animate-pulse">
    <div className="w-1/3 bg-gray-200 rounded-l-xl"></div>
    <div className="w-2/3 p-6 space-y-4">
      <div className="h-6 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      <div className="pt-4 mt-4 border-t border-gray-200">
        <div className="h-10 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  </div>
);

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  }).format(new Date(dateString));
};

function BuyerTicket() {
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const { data: ticketsData, isLoading, isError, error } = useQuery({
    queryKey: ['buyer-tickets', pageIndex, pageSize],
    queryFn: async () => {
      try {
        const res = await repository.get('/buyer/tickets', {
          params: { page: pageIndex, size: pageSize }
        });
        if (res.status !== 200) {
          throw new Error(res.data.message || "Gagal mengambil data tiket");
        }
        return res.data.data;
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
  });

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Tiket Saya</h1>

        {isLoading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => <TicketCardSkeleton key={i} />)}
          </div>
        ) : isError ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-red-500">Gagal memuat tiket: {(error as Error).message}</p>
          </div>
        ) : !ticketsData || ticketsData.content.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <Ticket className="mx-auto h-16 w-16 text-gray-400" />
            <p className="mt-4 text-xl font-semibold text-gray-700">Anda belum memiliki tiket.</p>
            <p className="text-gray-500 mt-2">Semua tiket event yang Anda beli akan muncul di sini.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {ticketsData.content.map((ticket: TicketType) => {
              const posterUrl = ticket.posterUrl ? `${baseUrl}${ticket.posterUrl}` : '/placeholder.jpg';
              return (
                
                <div key={ticket.id} className="bg-white rounded-2xl cursor-pointer shadow-xl flex flex-col sm:flex-row overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
                  <div className="w-full sm:w-1/3 relative h-48 sm:h-auto">
                    <Image
                      src={posterUrl}
                      alt={ticket.eventTitle}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>

                  <div className="hidden sm:flex flex-col items-center bg-white">
                    <div className="w-px h-full bg-gray-200 border-l-2 border-dashed border-gray-300"></div>
                  </div>

                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${ticket.isUsed ? 'bg-gray-200 text-gray-600' : 'bg-green-100 text-green-800'}`}>
                          {ticket.isUsed ? 'Sudah Digunakan' : 'Aktif'}
                        </span>
                        <p className="text-xs text-gray-500">Diselenggarakan oleh <span className="font-semibold">{ticket.organizerName}</span></p>
                      </div>
                      <Link href={`/ticket/${ticket.id}`} className="text-2xl font-bold text-gray-900 mt-2">{ticket.eventTitle}</Link>
                      <p className="text-lg font-semibold text-blue-600">{ticket.ticketTypeName}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-3">
                        <Calendar size={16} />
                        <span>{formatDate(ticket.eventStartDate)}</span>
                      </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-dashed flex items-center justify-between gap-4">
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Kode Unik</p>
                        <p className="font-mono text-sm font-semibold tracking-wider text-gray-800">{ticket.uniqueCode.split('-')[0] + ticket.uniqueCode.split('-')[1]}</p>
                      </div>
                      <div className="text-center p-2 bg-white border rounded-lg">
                        <QrCode size={48} className="text-gray-800" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        )}

        {ticketsData && ticketsData.totalPages > 1 && (
          <div className="flex items-center justify-between mt-8">
            <span className="text-sm text-gray-600">
              Halaman <span className="font-semibold">{pageIndex + 1}</span> dari <span className="font-semibold">{ticketsData.totalPages}</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, pageIndex: prev.pageIndex - 1 }))}
                disabled={ticketsData.first}
                className="p-2 rounded-md border bg-white hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setPagination(prev => ({ ...prev, pageIndex: prev.pageIndex + 1 }))}
                disabled={ticketsData.last}
                className="p-2 rounded-md border bg-white hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BuyerTicket;
