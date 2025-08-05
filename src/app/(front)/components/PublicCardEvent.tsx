'use client'
import type { PublicEvent } from '@/types/Event'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Calendar, MapPin } from 'lucide-react'

// Helper untuk memformat tanggal
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

function PublicCardEvent({ event }: { event: PublicEvent }) {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
  const posterUrl = event.posterUrl ? `${baseUrl}${event.posterUrl}` : '/placeholder.jpg'; // Sediakan gambar fallback

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group">
      <div className="relative">
        {/* Poster Event dengan Link */}
        <Link href={`/event/${event.slug}`} >
          <div className="block w-full h-48">
            <Image
              src={posterUrl}
              alt={`Poster for ${event.title}`}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        </Link>
        {/* Kategori Event */}
        <div className="absolute top-3 left-3 bg-white/90 text-blue-800 text-xs font-bold px-3 py-1 rounded-full shadow">
          {event.eventCategory}
        </div>
      </div>
      
      {/* Detail Event */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 truncate hover:text-blue-600 transition-colors">
          <Link href={`/event/${event.slug}`}>
            {event.title}
          </Link>
        </h3>
        
        <div className="mt-2 flex items-center text-sm text-gray-600 gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span>{formatDate(event.startDate)}</span>
        </div>

        <div className="mt-1.5 flex items-center text-sm text-gray-600 gap-2">
          <MapPin className="w-4 h-4 text-gray-500" />
          <span>{event.venueName}, {event.city}</span>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">Diselenggarakan oleh:</p>
          <p className="font-semibold text-gray-800 text-sm">{event.organizerName}</p>
        </div>
      </div>
    </div>
  )
}

export default PublicCardEvent
