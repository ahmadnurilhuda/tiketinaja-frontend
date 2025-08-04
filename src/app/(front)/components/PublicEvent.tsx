"use client";
import repository from "@/app/config/AxiosClientConfig";
import { useEventCategory } from "@/app/context/EventCategoryProvider";
import { useRegional } from "@/app/context/RegionalProvider";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import PublicCardEvent from "./PublicCardEvent";
import type { PublicEvent } from "@/types/Event";
import {
  Calendar,
  Search,
  X,
  Clock,
  ChevronLeft,
  ChevronRight,
  LocationEdit,
} from "lucide-react";
import { City } from "@/types/City";
import { PaginationState } from "@tanstack/react-table";
import { Province } from "@/types/Province";
import { Category } from "@/types/EventCategory";

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

function PublicEvent() {
  const { provinces, cities} = useRegional();
  const { eventCategories } = useEventCategory();
  const [formKey, setFormKey] = useState(0);
  const [filter, setFilter] = useState({
    title: "",
    eventCategoryId: "",
    provinceId: "",
    cityId: "",
    sortBy: "createdAt,desc",
  });
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 12,
  });
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["public-events", filter, pageIndex, pageSize],
    queryFn: async () => {
      try {
        const res = await repository.get("/public/events", {
          params: {
            title: filter.title,
            eventCategoryId: filter.eventCategoryId,
            provinceId: filter.provinceId,
            cityId: filter.cityId,
            sort: filter.sortBy,
            page: pageIndex,
            size: pageSize,
          },
        });
        if (res.status !== 200) {
          throw new Error(res.data.message || "Gagal mengambil event");
        }
        return res.data.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  });

  const sortByOptions = [
    { value: "createdAt,desc", label: "Terbaru" },
    { value: "createdAt,asc", label: "Terlama" },
    { value: "startDate,asc", label: "Waktu Terdekat" },
  ];

  const handleReset = () => {
    setFilter({
      title: "",
      provinceId: "",
      cityId: "",
      sortBy: "createdAt,desc",
      eventCategoryId: "",
    });
    setFormKey((prevKey) => prevKey + 1);
  };

  const handleFilterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const newFilter = {
      title: formData.get("title") as string,
      provinceId: formData.get("provinceId") as string,
      cityId: formData.get("cityId") as string,
      sortBy: formData.get("sortBy") as string,
      eventCategoryId: formData.get("eventCategoryId") as string,
    };
    setFilter(newFilter);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-4xl font-bold text-center mb-2 text-gray-900">
        Temukan Event Favoritmu
      </h1>
      <p className="text-lg text-center text-gray-600 mb-8">
        Jelajahi ribuan acara menarik di seluruh Indonesia.
      </p>

      <form
        key={formKey}
        onSubmit={handleFilterSubmit}
        className="mb-6 w-full flex flex-wrap items-center gap-4 p-4 bg-gray-100 rounded-xl border"
      >
        {/* Input Judul */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          <input
            name="title"
            type="text"
            placeholder="Cari Event..."
            defaultValue={filter.title}
            className="w-full rounded-lg bg-white border border-gray-300 py-2 pl-10 pr-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Filter Provinsi */}
        <div className="relative flex-1 min-w-[160px]">
          <LocationEdit className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          <select
            name="provinceId"
            defaultValue={filter.provinceId}
            className="w-full pl-10 pr-3 py-2 rounded-lg bg-white border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Semua Provinsi</option>
            {provinces?.map((prov: Province) => (
              <option key={prov.id} value={prov.id}>
                {prov.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Kota */}
        <div className="relative flex-1 min-w-[160px]">
          <LocationEdit className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          <select
            name="cityId"
            defaultValue={filter.cityId}
            className="w-full pl-10 pr-3 py-2 rounded-lg bg-white border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Semua Kota</option>
            {cities?.map((city: City) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        <div className="relative flex-1 min-w-[160px]">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          <select
            name="category"
            defaultValue={filter.eventCategoryId}
            className="w-full pl-10 pr-3 py-2 rounded-lg bg-white border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Semua Kategori</option>
            {eventCategories?.map((cat: Category) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="relative flex-1 min-w-[160px]">
          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          <select
            name="sortBy"
            defaultValue={filter.sortBy}
            className="w-full pl-10 pr-3 py-2 rounded-lg bg-white border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {sortByOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 ml-auto">
          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
          >
            <Search size={18} />
            <span>Filter</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 bg-white text-gray-700 font-semibold px-5 py-2 rounded-lg hover:bg-gray-200 border border-gray-300 shadow-sm transition-colors"
          >
            <X size={18} />
            <span>Reset</span>
          </button>
        </div>
      </form>

      <div>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-16">
            <p className="text-red-500">Gagal memuat event: {error.message}</p>
          </div>
        ) : data?.content?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.content.map((event: PublicEvent) => (
              <PublicCardEvent key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl font-semibold text-gray-700">
              Oops! Event tidak ditemukan.
            </p>
            <p className="text-gray-500 mt-2">
              Coba gunakan kata kunci atau filter yang berbeda.
            </p>
          </div>
        )}
      </div>

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between mt-8">
          <span className="text-sm text-gray-600">
            Menampilkan{" "}
            <span className="font-semibold">{data.numberOfElements}</span> dari{" "}
            <span className="font-semibold">{data.totalElements}</span> event
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  pageIndex: prev.pageIndex - 1,
                }))
              }
              disabled={data.first} 
              className="p-2 rounded-md border bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm font-semibold px-2">{pageIndex + 1}</span>
            <button
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  pageIndex: prev.pageIndex + 1,
                }))
              }
              disabled={data.last}
              className="p-2 rounded-md border bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PublicEvent;
