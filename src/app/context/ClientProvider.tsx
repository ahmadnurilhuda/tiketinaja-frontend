"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { User } from "lucide-react";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { ToastContainer } from "react-toastify";
import EventCategoryProvider from "./EventCategoryProvider";
import RegionalProvider from "./RegionalProvider";

export interface ClientProviderProps {
  children: React.ReactNode;
  session: Session | null;
}

function ClientProvider({ children, session }: ClientProviderProps) {
  const queryClient = new QueryClient();
  return (
    <>
      <SessionProvider session={session}>
        <QueryClientProvider client={queryClient}>
          <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <RegionalProvider>
            <EventCategoryProvider>{children}</EventCategoryProvider>
          </RegionalProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </SessionProvider>
    </>
  );
}

export default ClientProvider;
