'use client';
import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import NavbarFront from "./(front)/components/NavbarFront";
import PublicCardEvent from "./(front)/components/PublicCardEvent";
import { useQuery } from "@tanstack/react-query";
import repository from "@/app/config/AxiosClientConfig";
import { PublicEvent } from "@/types/Event";
import Image from "next/image";
import FooterFront from "./(front)/components/FooterFront";

const CardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
    <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
    <div className="p-5">
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
      <div className="h-6 bg-gray-300 rounded w-3/4 mb-2 animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4 animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
    </div>
  </div>
);

function HomePage() {
  const { data: featuredEvents, isLoading, isError } = useQuery({
    queryKey: ["featured-public-events"],
    queryFn: async () => {
      try {
        const res = await repository.get("/public/events", {
          params: {
            page: 0,
            size: 3,
            sort: "startDate,asc",
          },
        });
        if (res.status !== 200) {
          throw new Error(res.data.message || "Gagal mengambil event unggulan");
        }
        return res.data.data.content;
      } catch (error) {
        console.error("Gagal mengambil event unggulan:", error);
        throw error;
      }
    },
  });

  return (
    <div className="bg-gray-50">
      <NavbarFront />
      <main>
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center text-center text-white">
          <div className="absolute inset-0 bg-black/60 z-10"></div>
          <Image
            src="/images/hero-background.jpg"
            alt="Konser musik"
            width={1920}
            height={1080}
            className="absolute inset-0 w-full h-full object-cover z-0"
            priority
          />
          <div className="relative z-20 p-4">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight [text-shadow:_0_3px_5px_rgb(0_0_0_/_40%)]">
              Temukan & Pesan Tiket Event Terbaik
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-200 [text-shadow:_0_2px_3px_rgb(0_0_0_/_40%)]">
              Dari konser musik, pameran seni, hingga workshop inspiratif, semua ada di sini.
            </p>
            <div className="mt-8 flex justify-center">
              <Link href="/event">
                <p className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300">
                  Jelajahi Event Sekarang
                  <ArrowRight />
                </p>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Events Section */}
        <section className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Event Terpopuler</h2>
              <p className="mt-4 text-lg text-gray-600">Jangan sampai ketinggalan acara-acara paling hits saat ini.</p>
            </div>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {isLoading ? (
                [...Array(3)].map((_, i) => <CardSkeleton key={i} />)
              ) : isError ? (
                <p className="col-span-full text-center text-red-500">Gagal memuat event.</p>
              ) : (
                featuredEvents?.map((event: PublicEvent) => (
                  <PublicCardEvent key={event.id} event={event} />
                ))
              )}
            </div>
          </div>
        </section>

        <section className="bg-blue-700">
          <div className="max-w-4xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              <span className="block">Punya Acara Keren?</span>
              <span className="block">Daftarkan Event Anda di Tiketinaja!</span>
            </h2>
            <p className="mt-4 text-lg leading-6 text-blue-100">
              Jangkau audiens yang lebih luas dan kelola event Anda dengan mudah bersama kami.
            </p>
            <Link href="/join-organizer">
              <p className="mt-8 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-full shadow-sm text-base font-medium text-blue-600 bg-white hover:bg-blue-50 sm:w-auto">
                Jadi Organizer Sekarang
              </p>
            </Link>
          </div>
        </section>
        
        {/* Footer */}
        <FooterFront />
      </main>
    </div>
  );
}

export default HomePage;
