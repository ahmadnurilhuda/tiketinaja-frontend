'use client'
import React from 'react'
import Image from 'next/image'
import { Calendar } from 'lucide-react'
import { TicketType } from '@/types/Ticket';

interface BuyerTicketDetailProps {
  ticket: TicketType | null;
}

// Helper untuk format tanggal
const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  }).format(new Date(dateString));
};

function BuyerTicketDetail({ ticket }: BuyerTicketDetailProps) {
  if (!ticket) {
    return (
      <div className="flex items-center justify-center h-full p-8 bg-gray-50 rounded-2xl">
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Pilih Tiket</h3>
          <p className="mt-1 text-sm text-gray-500">Pilih salah satu tiket di sebelah kiri untuk melihat detailnya.</p>
        </div>
      </div>
    );
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
  const posterUrl = ticket.posterUrl ? `${baseUrl}${ticket.posterUrl}` : null;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Bagian Header Gambar */}
        <div className="relative w-full h-48 bg-gray-200 flex items-center justify-center">
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={`Poster for ${ticket.eventTitle}`}
              layout="fill"
              objectFit="cover"
            />
          ) : (
            <div className="text-gray-400">
              {/* Placeholder Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        {/* Konten Detail Tiket */}
        <div className="p-6 md:p-8">
          <div className="flex flex-col sm:flex-row justify-between sm:items-start">
            {/* Kiri: Info Event */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{ticket.eventTitle}</h1>
              <p className="mt-1 text-lg font-semibold text-blue-600">{ticket.ticketTypeName}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                <Calendar size={16} />
                <span>{formatDate(ticket.eventStartDate)}</span>
              </div>
            </div>
            {/* Kanan: Info Pengguna & Status */}
            <div className="text-left sm:text-right mt-4 sm:mt-0">
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${ticket.isUsed ? 'bg-gray-200 text-gray-600' : 'bg-green-100 text-green-800'}`}>
                {ticket.isUsed ? 'Sudah Digunakan' : 'Tiket Aktif'}
              </span>
              <p className="mt-2 text-sm text-gray-500">Kode Unik</p>
              <p className="font-mono text-lg font-semibold tracking-wider text-gray-800">{ticket.uniqueCode}</p>
              <p className="mt-1 text-sm text-gray-500">Atas Nama: <span className="font-semibold">{ticket.userFullName}</span></p>
            </div>
          </div>

          <hr className="my-6" />

          {/* Deskripsi Tiket */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Deskripsi Tiket</h2>
            <p className="text-gray-600">{ticket.ticketTypeDescription}</p>
          </div>

          {/* Info Organizer */}
          <div className="mt-8 text-right">
            <p className="text-xs text-gray-400">Diselenggarakan oleh</p>
            <p className="text-sm font-semibold text-gray-700">{ticket.organizerName}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BuyerTicketDetail;
