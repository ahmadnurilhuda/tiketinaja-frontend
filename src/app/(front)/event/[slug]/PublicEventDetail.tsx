'use client'
import type { PublicEvent } from '@/types/Event'
import React from 'react'
import Image from 'next/image'
import { Calendar, MapPin } from 'lucide-react'
import PublicTicketType from '../../components/PublicTicketType'
import Link from 'next/link'

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString));
};

function PublicEventDetail({ event }: { event: PublicEvent }) {
  if (!event) {
    return <div className="p-8 text-center">Memuat data event...</div>;
  }

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
  const posterUrl = event.posterUrl ? `${baseUrl}${event.posterUrl}` : null;
  const venueLayoutUrl = event.venueLayoutUrl ? `${baseUrl}${event.venueLayoutUrl}` : null;

  return (
    <div className="bg-white">
      <div className="relative h-64 md:h-96 w-full">
        {posterUrl && (
          <Image
            src={posterUrl}
            alt={`Poster for ${event.title}`}
            layout="fill"
            objectFit="cover"
            className="bg-gray-200"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      </div>

      <div className="max-w-5xl mx-auto p-6 md:p-8 -mt-32 relative">
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-10">
          <div className="border-b pb-6 mb-6">
            <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold mb-3 px-3 py-1 rounded-full">
              {event.eventCategory}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              {event.title}
            </h1>
            <div className="mt-4 space-y-2 text-gray-600">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-500" />
                <span className="font-medium">{event.venueName}, {event.city}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span className="font-medium">
                  {formatDate(event.startDate)} - {formatDate(event.endDate)}
                </span>
              </div>
              <p className="pt-2">Diselenggarakan oleh <span className="font-bold text-gray-800">{event.organizerName}</span></p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mb-8">
            <div className="prose">
              <h2 className="font-bold text-xl text-gray-800">Deskripsi</h2>
              <p>{event.description}</p>
            </div>
            <div className="prose">
              <h2 className="font-bold text-xl text-gray-800">Syarat & Ketentuan</h2>
              <p>{event.requirements}</p>
            </div>
          </div>

          {venueLayoutUrl && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Layout Venue</h2>
              <div className="relative w-full h-auto bg-gray-100 rounded-lg overflow-hidden border">
                <Image
                  src={venueLayoutUrl}
                  alt={`Layout venue untuk ${event.title}`}
                  width={1200}
                  height={800}
                  className="w-full h-auto"
                />
              </div>
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-6 border-t pt-6">
              <h2 className="text-2xl font-bold text-gray-800">Jenis Tiket</h2>
              <Link href={`/event/${event.slug}/checkout`} className="bg-blue-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md">
                Pesan Tiket
              </Link>
            </div>
            <div id="ticket-type-list" className="space-y-4">
              <PublicTicketType eventId={event.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PublicEventDetail
