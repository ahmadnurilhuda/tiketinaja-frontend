"use client";
import type { PublicEvent } from "@/types/Event";
import React, { useState } from "react";
import Image from "next/image";
import { Calendar, MapPin, Trash2, Ticket } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import repository from "@/app/config/AxiosClientConfig";
import { TicketType } from "@/types/TicketType";
import { toast } from "react-toastify";

type CartItem = {
  ticketTypeId: string;
  quantity: number;
  name: string;
  price: number;
};

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString));
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

const TicketRowSkeleton = () => (
  <div className="border border-gray-200 rounded-lg p-5 animate-pulse">
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <div className="h-6 bg-gray-300 rounded w-48"></div>
        <div className="h-8 bg-gray-300 rounded w-32"></div>
      </div>
      <div className="flex items-end gap-3">
        <div className="h-10 bg-gray-200 rounded w-24"></div>
        <div className="h-10 bg-blue-200 rounded w-28"></div>
      </div>
    </div>
  </div>
);

function PublicEventDetailCheckout({ event }: { event: PublicEvent }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedQuantities, setSelectedQuantities] = useState<{
    [key: string]: number;
  }>({});

  const {
    data: ticketTypes,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["publicTicketTypes", event.id],
    queryFn: async () => {
      const res = await repository.get(
        `/public/ticket-types/${event.id}/event`
      );
      if (res.status !== 200)
        throw new Error(res.data.message || "Gagal mengambil tiket");
      return res.data.data;
    },
    enabled: !!event.id,
  });
  const getSaleStatus = (start: string, end: string) => {
    const now = new Date();
    if (now < new Date(start)) return { text: "Segera Hadir", active: false };
    if (now > new Date(end))
      return { text: "Penjualan Berakhir", active: false };
    return { text: "Tersedia", active: true };
  };

  const handleAddToCart = (ticket: TicketType) => {
    const quantity = selectedQuantities[ticket.id] || 0;
    if (quantity === 0) {
      toast.warn("Silakan pilih jumlah tiket.");
      return;
    }
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.ticketTypeId === ticket.id
      );
      if (existingItem) {
        return prevItems.map((item) =>
          item.ticketTypeId === ticket.id ? { ...item, quantity } : item
        );
      } else {
        return [
          ...prevItems,
          {
            ticketTypeId: ticket.id,
            quantity,
            name: ticket.name,
            price: ticket.price,
          },
        ];
      }
    });
    toast.success(`${quantity} tiket "${ticket.name}" ditambahkan.`);
    console.log(selectedQuantities);
    console.log(cartItems);
  };
  const handleRemoveFromCart = (ticketTypeId: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.ticketTypeId !== ticketTypeId)
    );
    toast.info("Tiket dihapus dari pesanan.");
  };
  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    const payload = {
      items : cartItems.map((item) => ({
        ticketTypeId: item.ticketTypeId,
        quantity: item.quantity,
      })),
    }
    try {
      const res = await repository.post("/buyer/checkout/event/ticket-type", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.status !== 200) {
        throw new Error(res.data.message || "Gagal melakukan checkout");
      }
      const data =  await res.data.data;
      if(data?.paymentUrl){
        toast.success("Checkout berhasil! Silakan melakukan pembayaran.");
        window.open(data.paymentUrl, "_blank");
      }
      setSelectedQuantities({});
      setCartItems([]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan");
      console.log(error);
    }
  };

  if (!event) {
    return <div className="p-8 text-center">Memuat data event...</div>;
  }

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
  const posterUrl = event.posterUrl ? `${baseUrl}${event.posterUrl}` : null;

  return (
    <section className="bg-gray-50 min-h-screen p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-8">
          {posterUrl && (
            <Image
              src={posterUrl}
              alt={`Latar belakang untuk ${event.title}`}
              layout="fill"
              objectFit="cover"
              className="z-0"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10"></div>
          <div className="relative z-20 p-8 md:p-12 text-white flex flex-col justify-end min-h-[300px]">
            <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-sm font-semibold mb-3 px-3 py-1 rounded-full w-fit">
              {event.eventCategory}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight [text-shadow:_0_2px_4px_rgb(0_0_0_/_50%)]">
              {event.title}
            </h1>
            <div className="mt-4 space-y-2 text-gray-200">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5" />
                <span className="font-medium">
                  {event.venueName}, {event.city}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5" />
                <span className="font-medium">
                  {formatDate(event.startDate)}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Pilih Jenis Tiket
            </h2>
            <div id="ticket-type-selection-list" className="space-y-5">
              {isLoading ? (
                <div className="space-y-4">
                  <TicketRowSkeleton />
                  <TicketRowSkeleton />
                </div>
              ) : isError ? (
                <p className="text-red-500 text-center py-8">
                  Gagal memuat jenis tiket
                </p>
              ) : !ticketTypes || ticketTypes.length === 0 ? (
                <div className="text-center text-gray-500 py-12 border-2 border-dashed rounded-lg">
                  <Ticket className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 font-semibold">Tiket belum tersedia.</p>
                </div>
              ) : (
                ticketTypes.map((ticket: TicketType) => {
                  const status = getSaleStatus(
                    ticket.startDate,
                    ticket.endDate
                  );
                  return (
                    <div
                      key={ticket.id}
                      className={`border rounded-xl p-5 transition-all ${
                        status.active
                          ? "border-gray-200 bg-white"
                          : "bg-gray-50 border-gray-100"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                        <div className="flex-1">
                          <h3
                            className={`text-xl font-bold ${
                              status.active ? "text-gray-900" : "text-gray-500"
                            }`}
                          >
                            {ticket.name}
                          </h3>
                          <p
                            className={`mt-1 text-2xl font-extrabold ${
                              status.active ? "text-blue-600" : "text-gray-400"
                            }`}
                          >
                            {formatPrice(ticket.price)}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs">
                            <span
                              className={`font-semibold px-2 py-0.5 rounded-full ${
                                status.active
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {status.text}
                            </span>
                            <span className="text-gray-400">
                              Stok: {ticket.quantity}
                            </span>
                          </div>
                        </div>
                        {status.active && (
                          <div className="flex items-end gap-3 mt-4 sm:mt-0">
                            <div>
                              <label
                                htmlFor={`qty-${ticket.id}`}
                                className="block text-xs font-medium text-gray-500 mb-1"
                              >
                                Jumlah
                              </label>
                              <select
                                id={`qty-${ticket.id}`}
                                className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                value={selectedQuantities[ticket.id] || 0}
                                onChange={(e) =>
                                  setSelectedQuantities((prev) => ({
                                    ...prev,
                                    [ticket.id]: parseInt(e.target.value),
                                  }))
                                }
                              >
                                {[0, 1, 2, 3, 4, 5].map((q) => (
                                  <option key={q} value={q}>
                                    {q}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <button
                              onClick={() => handleAddToCart(ticket)}
                              className="bg-blue-600 text-white font-bold px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors h-10"
                            >
                              Add
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-lg sticky top-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Ringkasan Pesanan
            </h2>

            {cartItems.length > 0 ? (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.ticketTypeId}
                    className="flex justify-between items-start"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        {formatPrice(item.price)} x {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="font-bold text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      <button
                        onClick={() => handleRemoveFromCart(item.ticketTypeId)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}

                <div className="border-t pt-4 mt-4 flex justify-between items-center">
                  <p className="text-lg font-semibold text-gray-700">Total</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatPrice(total)}
                  </p>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full mt-6 bg-blue-600 cursor-pointer text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Pesan Sekarang
                </button>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <p>Keranjang Anda masih kosong.</p>
                <p className="text-sm">
                  Silakan pilih tiket untuk melanjutkan.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default PublicEventDetailCheckout;
