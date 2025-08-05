'use client'
import repository from '@/app/config/AxiosClientConfig'
import { Order, OrderMetaItem } from '@/types/Order'
import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import { PaginationState } from '@tanstack/react-table'
import { ChevronLeft, ChevronRight, Ticket, ShoppingCart, Calendar } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

// Komponen Skeleton untuk state loading
const OrderCardSkeleton = () => (
  <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
    <div className="flex justify-between items-center border-b pb-3 mb-3">
      <div className="h-5 bg-gray-200 rounded w-1/4"></div>
      <div className="h-6 bg-gray-300 rounded w-1/5"></div>
    </div>
    <div className="flex gap-4 mt-4">
      <div className="w-24 h-24 bg-gray-200 rounded-md"></div>
      <div className="flex-1 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    </div>
  </div>
);

// Helper untuk format harga
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", minimumFractionDigits: 0,
  }).format(price);
};

// Helper untuk format tanggal
const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat("id-ID", {
    day: 'numeric', month: 'long', year: 'numeric'
  }).format(new Date(dateString));
};

// Helper untuk warna status
const getStatusClasses = (status: string) => {
  switch (status) {
    case 'PAID':
      return 'bg-green-100 text-green-800';
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

function BuyerOrder() {
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const { data: ordersData, isLoading, isError, error } = useQuery({
    queryKey: ['buyer-orders', pageIndex, pageSize],
    queryFn: async () => {
      try {
        const res = await repository.get('/buyer/orders', {
          params: { page: pageIndex, size: pageSize }
        });
        if (res.status !== 200) {
          throw new Error(res.data.message || "Gagal mengambil data pesanan");
        }
        return res.data.data;
      } catch (err) {
        console.error(err);
        throw err;
      }
    }
  });

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Riwayat Pesanan Saya</h1>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <OrderCardSkeleton key={i} />)}
          </div>
        ) : isError ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-red-500">Gagal memuat pesanan: {(error as Error).message}</p>
          </div>
        ) : !ordersData || ordersData.content.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <ShoppingCart className="mx-auto h-16 w-16 text-gray-400" />
            <p className="mt-4 text-xl font-semibold text-gray-700">Anda belum memiliki pesanan.</p>
            <p className="text-gray-500 mt-2">Ayo jelajahi event dan buat pesanan pertamamu!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {ordersData.content.map((order: Order) => {
              let ticketItems: OrderMetaItem[] = [];
              try {
                ticketItems = JSON.parse(order.meta);
              } catch (e) {
                console.error("Gagal mem-parsing meta JSON:", e);
              }

              const firstItem = ticketItems[0];
              const posterUrl = firstItem?.eventPosterUrl ? `${baseUrl}${firstItem.eventPosterUrl}` : null;
              return (
                <div key={order.id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-gray-200 pb-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Order ID</p>
                      <p className="font-mono font-semibold text-gray-800">#{order.id}</p>
                    </div>
                    <div className={`text-sm font-bold px-3 py-1 rounded-full mt-2 sm:mt-0 ${getStatusClasses(order.status)}`}>
                      {order.status}
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Kolom Kiri: Poster Event */}
                    {posterUrl && firstItem && (
                      <Link href={`/event/${firstItem.eventSlug}`} className='block w-full md:w-32 h-40 md:h-32 flex-shrink-0'>
                          <Image
                            src={posterUrl}
                            alt={firstItem.eventTitle}
                            width={128}
                            height={128}
                            className="w-full h-full object-cover rounded-lg"
                          />
                      </Link>
                    )}
                    
                    {/* Kolom Kanan: Detail Pesanan */}
                    <div className="flex-1">
                      {firstItem && (
                        <div className="mb-4">
                          <Link href={`/event/${firstItem.eventSlug}`} className="font-bold text-lg text-gray-900 hover:text-blue-600 transition-colors">
                            {firstItem.eventTitle}
                          </Link>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <Calendar size={14} />
                            <span>{formatDate(firstItem.eventStartDate)}</span>
                          </div>
                        </div>
                      )}

                      <div className="space-y-3 mb-4 border-t border-gray-100 pt-3">
                        {ticketItems.map((item, index) => (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2">
                              <Ticket size={16} className="text-blue-500" />
                              <p className="text-gray-700">
                                <span className="font-semibold">{item.ticketTypeName}</span> (x{item.ticketTypeQuantity})
                              </p>
                            </div>
                            <p className="font-medium text-gray-800">{formatPrice(item.ticketTypePrice * item.ticketTypeQuantity)}</p>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                        <p className="text-md font-semibold text-gray-600">Total Pembayaran</p>
                        <p className="text-xl font-bold text-blue-600">{formatPrice(order.totalAmount)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {ordersData && ordersData.totalPages > 1 && (
          <div className="flex items-center justify-between mt-8">
            <span className="text-sm text-gray-600">
              Halaman <span className="font-semibold">{pageIndex + 1}</span> dari <span className="font-semibold">{ordersData.totalPages}</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, pageIndex: prev.pageIndex - 1 }))}
                disabled={ordersData.first}
                className="p-2 rounded-md border bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setPagination(prev => ({ ...prev, pageIndex: prev.pageIndex + 1 }))}
                disabled={ordersData.last}
                className="p-2 rounded-md border bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default BuyerOrder;
