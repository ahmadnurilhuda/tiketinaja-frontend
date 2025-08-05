'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image' // Gunakan Image dari Next.js untuk optimasi
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'
import { 
  LayoutDashboard, 
  Calendar, 
  Wallet, 
  LogOut, 
  UserCircle2,
  Home // Ikon baru untuk homepage
} from 'lucide-react'
import repository from '@/app/config/AxiosClientConfig'
import { Organizer } from '@/types/Organizer'

function SidebarOrganizer() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const { data: profile, isLoading } = useQuery<Organizer>({
    queryKey: ['organizer-profile'],
    queryFn: async () => {
      try {
        const response = await repository.get("/organizer/profile");
        if (response.status !== 200) {
          throw new Error(response.data?.message || "Gagal mengambil profil");
        }
        return response.data?.data;
      } catch (error) {
        console.error("Error fetching organizer profile:", error);
        throw error;
      }
    },
    enabled: !!session, // Hanya jalankan query jika sesi sudah ada
  });

  const navLinks = [
    { name: "Homepage", href: "/", icon: Home },
    { name: "Dashboard", href: "/organizer", icon: LayoutDashboard },
    { name: "My Events", href: "/organizer/event", icon: Calendar },
    { name: "Transactions", href: "/organizer/transactions", icon: Wallet },
  ];

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-gray-900 text-white flex flex-col z-40">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-center truncate">
          {isLoading ? 'Loading...' : (profile?.name || 'Organizer Panel')}
        </h1>
      </div>

      <div className="p-4 flex flex-col items-center border-b border-gray-700">
        {profile?.profilePictureUrl ? (
          <Image
            src={`${baseUrl}/uploads${profile.profilePictureUrl}`}
            alt="Foto Profil Organizer"
            width={64}
            height={64}
            className="w-16 h-16 rounded-full object-cover mb-2"
          />
        ) : (
          <UserCircle2 size={64} className="mb-2 text-gray-500" />
        )}
        <p className="font-semibold text-center">{profile?.name || 'Organizer'}</p>
        <p className="text-sm text-gray-400 truncate w-full text-center">{profile?.email || session?.user?.email}</p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navLinks.map((link) => {
          const isActive = pathname === link.href  ;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <link.icon size={20} />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-900/50 hover:text-white transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default SidebarOrganizer;
