"use client";
import { Event } from "@/types/Event";
import Image from "next/image";
import React from "react";
import { Calendar, MapPin, Ticket, Video, Edit } from "lucide-react";
import Link from "next/link";
import OrganizerTicketType from "../../(ticket-types)/OrganizerTicketType";
import {
  createTicketType,
  updateTicketType,
} from "../../(ticket-types)/TicketTypeActions";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { TicketType, TicketTypeRequest, } from "@/types/TicketType";
import TicketTypeForm from "../../components/TicketTypeForm";

interface OrganizerDetailEventProps {
  initialData?: Event;
}

function OrganizerDetailEvent({
  initialData: event,
}: OrganizerDetailEventProps) {
  const [editingTicketType, setEditingTicketType] =
    React.useState<TicketType | null>(null);
  const queryClient = useQueryClient();

  if (!event) {
    return (
      <main className="p-8 text-center">
        <p>Data event tidak ditemukan atau sedang dimuat...</p>
      </main>
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
  const posterImageUrl = event.posterUrl
    ? `${baseUrl}${event.posterUrl}`
    : null;
  const venueLayoutImageUrl = event.venueLayoutUrl
    ? `${baseUrl}${event.venueLayoutUrl}`
    : null;

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "full",
      timeStyle: "short",
    }).format(new Date(dateString));
  };

  const handleFormSubmit = async (values: TicketTypeRequest) => {
    console.log(`Form submitted with values: ${JSON.stringify(values, null, 2)}`);
    try {
      let result;
      if (editingTicketType) {
        result = await updateTicketType(editingTicketType.id, event.id, values);
      } else {
        result = await createTicketType(event.id, values);
      }
      if (result.success) {
        toast.success(result.message);
        setEditingTicketType(null);
        queryClient.invalidateQueries({ queryKey: ["ticketTypes", event.id] });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.log(error)
      toast.error("Terjadi kesalahan yang tidak diketahui.");
    }
  };

  return (
    <main className="bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{event.title}</h1>
            <p className="mt-2 text-lg text-gray-600">
              Diselenggarakan oleh{" "}
              <span className="font-semibold text-blue-600">
                {event.organizer.name}
              </span>
            </p>
          </div>
          <Link
            href={`/organizer/event/update/${event.id}`}
            className="flex cursor-pointer items-center gap-2 bg-white text-gray-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 border shadow-sm transition-colors"
          >
            <Edit size={16} />
            <span>Edit Event</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Kolom Kiri: Poster Event */}
          <div className="lg:col-span-1">
            {posterImageUrl ? (
              <div className="relative w-full h-[533px] rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={posterImageUrl}
                  alt={`Poster ${event.title}`}
                  layout="fill"
                  objectFit="cover"
                  className="bg-gray-200"
                  priority
                />
              </div>
            ) : (
              // Fallback jika gambar tidak ada, ukurannya disamakan.
              <div className="w-full h-[533px] bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                <span>Poster tidak tersedia</span>
              </div>
            )}
          </div>

          {/* Kolom Kanan: Detail Event */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Detail Event
            </h2>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <Calendar className="w-6 h-6 text-blue-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-700">
                    Tanggal dan Waktu
                  </h3>
                  <p className="text-gray-600">{formatDate(event.startDate)}</p>
                  <p className="text-gray-500 text-sm">sampai</p>
                  <p className="text-gray-600">{formatDate(event.endDate)}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-blue-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-700">Lokasi</h3>
                  <p className="text-gray-600">{event.venueName}</p>
                  <p className="text-gray-500">{event.venueAddress}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Ticket className="w-6 h-6 text-blue-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-700">Kategori</h3>
                  <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium mt-1 px-3 py-1 rounded-full">
                    {event.eventCategory.name}
                  </span>
                </div>
              </div>
              {event.isOnline && (
                <div className="flex items-start gap-4">
                  <Video className="w-6 h-6 text-green-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-700">Tipe Event</h3>
                    <p className="text-gray-600">
                      Event ini diselenggarakan secara online.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-gray-800">Deskripsi</h2>
            <p className="text-gray-600">{event.description}</p>
            {event.requirements && (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mt-6">
                  Syarat & Ketentuan
                </h2>
                <p className="text-gray-600">{event.requirements}</p>
              </>
            )}
          </div>
        </div>
        {venueLayoutImageUrl && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Layout Venue
            </h2>
            <div className="relative w-full h-96 overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={venueLayoutImageUrl}
                alt={`Layout ${event.title}`}
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Daftar Jenis Tiket
              </h2>
            </div>
            <div id="ticket-type-list" className="space-y-4">
              <OrganizerTicketType
                eventId={event.id}
                onEdit={(ticketType: TicketType) =>
                  setEditingTicketType(ticketType)
                }
              />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Tambah Jenis Tiket Baru
            </h2>
            <div id="ticket-type-form">
              <TicketTypeForm
                onFormSubmit={handleFormSubmit}
                initialData={editingTicketType ?? undefined}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default OrganizerDetailEvent;
