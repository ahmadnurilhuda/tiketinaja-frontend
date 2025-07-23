import type { Metadata } from "next";
import { Poppins } from 'next/font/google'
import "./globals.css";
import ClientProvider from "./context/ClientProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "./lib/auth";

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


export default async function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body className={poppins.className}>
        <ClientProvider session={session}>{children}</ClientProvider>
      </body>
    </html>
  );
}
