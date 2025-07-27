'use client'
import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Pencil, PlusCircle, Trash2, Ticket, ChevronLeft, ChevronRight } from "lucide-react";
import repository from "@/app/config/AxiosClientConfig";
import { Category } from "@/types/EventCategory";
import type { CellContext, PaginationState } from "@tanstack/react-table";
import Link from "next/link";
import { deleteEventCategory } from "./EventCategoryActions";
import { toast } from "react-toastify";

const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[...Array(10)].map((_, i) => ( 
      <div key={i} className="h-12 bg-gray-200 rounded-md animate-pulse"></div>
    ))}
  </div>
);

function AdminEventCategory() {
  const [filter, setFilter] = useState({
    name: "",
    sortBy: "createdAt,desc",
  });

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0, 
    pageSize: 10,  
  });

  const sortBy = [
    { value: "createdAt,desc", label: "Terbaru" },
    { value: "createdAt,asc", label: "Terlama" },
  ];

  const handleFilterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const newFilter = {
      name: formData.get("name") as string,
      sortBy: formData.get("sort") as string,
    };
    setFilter(newFilter);
    setPagination({ ...{ pageIndex, pageSize }, pageIndex: 0 }); 
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["event-categories", filter, pageIndex, pageSize], 
    queryFn: async () => {
      try {
        const res = await repository.get(
          `/admin/event-categories`, {
            params: {
              name: filter.name,
              sort: filter.sortBy,
              page: pageIndex,
              size: pageSize,
            }
          }
        );
        if (res.status !== 200) {
          throw new Error(res.data?.message || "Gagal mengambil data");
        }
        return res.data?.data; 
      } catch (err) {
        throw err instanceof Error
          ? err
          : new Error("Terjadi kesalahan tidak dikenal");
      }
    },
  });

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteEventCategory, 
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ['event-categories'] });
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

  const columns = useMemo(() => [
      {
        accessorKey: "name",
        header: "Nama Kategori",
        cell: (info: CellContext<Category, unknown>) => (
          <p className="font-semibold text-gray-800">
            {String(info.getValue())}
          </p>
        ),
      },
      {
        accessorKey: "description",
        header: "Deskripsi",
        cell: (info: CellContext<Category, unknown>) => (
          <p className="text-gray-600 truncate max-w-xs">
            {String(info.getValue())}
          </p>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Tanggal Dibuat",
        cell: (info: CellContext<Category, unknown>) => {
          const date = new Date(info.getValue() as string);
          return new Intl.DateTimeFormat("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }).format(date);
        },
      },
      {
        id: "actions",
        header: "Aksi",
        cell: ({ row }: CellContext<Category, unknown>) => (
          <div className="flex items-center gap-3">
            <Link
              href={`/admin/event-categories/update/${row.original.id}`}
              className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
              aria-label="Edit"
            >
              <Pencil size={18}>  </Pencil>
            </Link>
            <button
              onClick={() => handleDelete(row.original.id)}
              className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
              aria-label="Delete"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ),
      },
  ], []);

  const table = useReactTable({
    data: data?.content ?? [],
    columns,
    pageCount: data?.totalPages ?? -1,
    state: {
      pagination: { pageIndex, pageSize },
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true, 
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Ticket className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Manajemen Kategori Event
              </h1>
              <p className="text-gray-500">
                Kelola semua kategori event di sini.
              </p>
            </div>
          </div>
          <Link
            href="/admin/event-categories/create"
            className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <PlusCircle size={20} />
            <span>Tambah Kategori</span>
          </Link>
        </div>
        <form className="mb-6" onSubmit={handleFilterSubmit}>
          <div className="flex justify-end mb-4 gap-2">
            <input
              name="name"
              type="text"
              placeholder="Search by name"
              defaultValue={filter.name}
              className="border border-gray-300 rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <select
              name="sort" 
              defaultValue={filter.sortBy} 
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {sortBy.map((item, index) => (
                <option key={index} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="bg-blue-600 cursor-pointer text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              Filter
            </button>
          </div>
        </form>

        <div className="overflow-x-auto">
          {isLoading ? (
            <LoadingSkeleton />
          ) : isError ? (
            <div className="text-center py-10 bg-red-50 text-red-600 rounded-lg">
              <p>Terjadi kesalahan: {error?.message || "Tidak dapat memuat data."}</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} scope="col" className="px-6 py-3">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="bg-white border-b hover:bg-gray-50">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* 5. Tambahkan Kontrol Paginasi di sini */}
        <div className="flex items-center justify-end gap-4 mt-6">
          <span className="text-sm text-gray-600">
            Halaman{' '}
            <strong>
              {table.getState().pagination.pageIndex + 1} dari {table.getPageCount()}
            </strong>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-2 rounded-md border bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-2 rounded-md border bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminEventCategory;