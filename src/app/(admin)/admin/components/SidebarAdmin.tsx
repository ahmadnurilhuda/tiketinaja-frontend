'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { 
  LayoutDashboard, 
  Ticket, 
  Calendar, 
  Users, 
  Wallet, 
  LogOut, 
  UserCircle2 
} from 'lucide-react'

function SidebarAdmin() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const navLinks = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Event Categories", href: "/admin/event-categories", icon: Ticket },
    { name: "Events", href: "/admin/events", icon: Calendar },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Transactions", href: "/admin/transactions", icon: Wallet },
  ];

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-gray-900 text-white flex flex-col z-40">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-center">Tiketin Admin</h1>
      </div>

      <div className="p-4 flex flex-col items-center border-b border-gray-700">
        <UserCircle2 size={64} className="mb-2 text-gray-500" />
        <p className="font-semibold">{session?.user?.fullName || "Admin User"}</p>
        <p className="text-sm text-gray-400">{session?.user?.role || "Administrator"}</p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
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
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-900/50 hover:text-white transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default SidebarAdmin;