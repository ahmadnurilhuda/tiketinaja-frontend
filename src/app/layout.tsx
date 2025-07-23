import type { Metadata } from "next";
import { Poppins } from 'next/font/google'
import "./globals.css";
import ClientProvider from "./context/ClientProvider";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'], 
  variable: '--font-poppins',   
  display: 'swap',              
})


export const metadata: Metadata = {
  title: "TiketinAja",
  description: "Pilih TiketinAja sekarang!",
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
