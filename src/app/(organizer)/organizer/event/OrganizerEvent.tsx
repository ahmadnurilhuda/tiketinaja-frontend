"use client";
import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Pencil,
  PlusCircle,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  LocationEdit,
  Calendar,
  Clock,
  Eye,
} from "lucide-react";
import repository from "@/app/config/AxiosClientConfig";
import { useRegional } from "@/app/context/RegionalProvider";
import { Event } from "@/types/Event";
import { Province } from "@/types/Province";
import { City } from "@/types/City";
import type { CellContext, PaginationState } from "@tanstack/react-table";
import { Category } from "@/types/EventCategory";
import { useEventCategory } from "@/app/context/EventCategoryProvider";
import Link from "next/link";
import { deleteEvent } from "./EventActions";
import { toast } from "react-toastify";

// Komponen untuk UI saat loading
const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="h-16 bg-gray-200 rounded-md animate-pulse"></div>
    ))}
  </div>
);

export default function OrganizerEvent() {
  // Mengambil data provinsi & kota dari context
  const { provinces, cities } = useRegional();
  const { eventCategories } = useEventCategory();

  // State untuk filter dan paginasi
  const [filter, setFilter] = useState({
    title: "",
    eventCategoryId: "",
    provinceId: "",
    cityId: "",
    sortBy: "createdAt,desc",
  });

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  //! Data untuk dropdown sorting
  const sortByOptions = [
    { value: "createdAt,desc", label: "Terbaru Dibuat" },
    { value: "createdAt,asc", label: "Terlama Dibuat" },
    { value: "startDate,asc", label: "Tanggal Mulai (Terdekat)" },
    { value: "startDate,desc", label: "Tanggal Mulai (Terjauh)" },
  ];

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["organizer-events", filter, pageIndex, pageSize],
    queryFn: async () => {
      try {
        const response = await repository.get("/organizer/events", {
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
        if (response.status !== 200) {
          throw new Error(response.data?.message || "Gagal mengambil data");
        }
        return response.data?.data;
      } catch (err) {
        throw err instanceof Error
          ? err
          : new Error("Terjadi kesalahan tidak dikenal");
      }
    },
  });

  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
      mutationFn: deleteEvent, 
      onSuccess: (data) => {
        if (data.success) {
          toast.success(data.message);
          queryClient.invalidateQueries({ queryKey: ['organizer-events'] });
        } else {
          toast.error(data.message);
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const handleDelete = async (id: string)=>{
    deleteMutation.mutate(id);
  }

  //! Fungsi untuk menangani submit filter
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

  const [formKey, setFormKey] = useState(0);
  const handleReset = () => {
    setFilter({
      title: "",
      provinceId: "",
      cityId: "",
      sortBy: "createdAt,desc",
      eventCategoryId: "",
    });
    //! Mengubah key akan membuat form di-remount dan kembali ke nilai default-nya
    setFormKey((prevKey) => prevKey + 1);
  };
  //! Definisi kolom untuk tabel
  const columns = useMemo(
    () => [
      {
        accessorKey: "title",
        header: "Judul Event",
        cell: (info: CellContext<Event, unknown>) => (
          <p className="font-semibold text-gray-800">
            {String(info.getValue())}
          </p>
        ),
      },
      {
        accessorKey: "eventCategory.name",
        header: "Kategori",
        cell: (info: CellContext<Event, unknown>) => (
          <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">
            {String(info.getValue())}
          </span>
        ),
      },
      {
        header: "Lokasi",
        cell: ({ row }: CellContext<Event, unknown>) => (
          <div>
            <p className="font-medium text-gray-700">
              {row.original.venueName}
            </p>
            <p className="text-sm text-gray-500">{row.original.city.name}</p>
          </div>
        ),
      },
      {
        accessorKey: "startDate",
        header: "Tanggal Mulai",
        cell: (info: CellContext<Event, unknown>) =>
          new Intl.DateTimeFormat("id-ID", { dateStyle: "full" }).format(
            new Date(info.getValue() as string)
          ),
      },
      {
        id: "actions",
        header: "Aksi",
        cell: ({ row }: CellContext<Event, unknown>) => (
          <div className="flex items-center gap-2">
            <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-full">
              <Link href={`/organizer/event/update/${row.original.id}`}>
                <Pencil size={18} />
              </Link>
            </button>
            <button onClick={() => handleDelete(row.original.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-full">
              <Trash2 size={18} />
            </button>
            <button className="p-2 text-green-600 hover:bg-green-100 rounded-full">
              <Link href={`/organizer/event/${row.original.id}`}>
                <Eye size={18} />
              </Link>
            </button>
          </div>
        ),
      },
    ],
    []
  );

  //! Inisialisasi React Table
  const table = useReactTable({
    data: data?.content ?? [],
    columns,
    pageCount: data?.totalPages ?? -1,
    state: { pagination: { pageIndex, pageSize } },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded-xl shadow-md">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Manajemen Event Anda
            </h1>
            <p className="text-gray-500">
              Lihat, kelola, dan buat event baru di sini.
            </p>
          </div>
          <Link
            href="/organizer/event/create"
            className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 shadow-sm"
          >
            <PlusCircle size={20} />
            <span>Buat Event Baru</span>
          </Link>
        </div>

        {/* Form Filter */}
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
            className="w-full pl-10 pr-3 py-2 rounded-lg  bg-white border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
            name="eventCategoryId"
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

        {/* Tabel */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <LoadingSkeleton />
          ) : isError ? (
            <div className="text-center py-10 bg-red-50 text-red-600 rounded-lg">
              <p>Error: {error?.message}</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id}>
                    {hg.headers.map((h) => (
                      <th key={h.id} className="px-6 py-3">
                        {flexRender(h.column.columnDef.header, h.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="bg-white border-b hover:bg-gray-50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Paginasi */}
        <div className="flex items-center justify-end gap-4 mt-6">
          <span className="text-sm text-gray-600">
            Halaman{" "}
            <strong>
              {table.getState().pagination.pageIndex + 1} dari{" "}
              {table.getPageCount()}
            </strong>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-2 rounded-md border bg-white hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-2 rounded-md border bg-white hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
