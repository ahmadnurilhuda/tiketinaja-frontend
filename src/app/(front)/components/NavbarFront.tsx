"use client";
import { useSession, signOut } from "next-auth/react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, UserCircle2 } from "lucide-react";
import repository from "@/app/config/AxiosClientConfig";

function NavbarFront() {
  const { data: session } = useSession();
  const [isOrganizer, setIsOrganizer] = useState<boolean>(false);

  const pages = [{ name: "My Orders", href: "/orders" }];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (session?.accessToken) {
          const response = await repository.get("/auth/profile");
          console.log("Respons Profile API:", response.data);

          if (response.status !== 200) {
            throw new Error(response.data.message);
          }
          const profileData = response.data.data;
          if (profileData && typeof profileData.organizer === "boolean") {
            setIsOrganizer(profileData.organizer);
          }
        }
      } catch (error) {
        console.error("Gagal mengambil profil:", error);
      }
    };
    fetchProfile();
  }, [session, isOrganizer]);

  return (
    <header className="bg-blue-600 shadow-lg sticky top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 text-xl font-bold text-white">
            TiketinAja
          </Link>
        </div>
        <div className="flex items-center gap-x-4">
          <Link
            href="/event"
            className="rounded-md bg-white px-3.5 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Events
          </Link>
          {session?.user ? (
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <MenuButton className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-700/50 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-blue-500/50 hover:bg-blue-700">
                  <UserCircle2 className="h-6 w-6 text-blue-200" />
                  <span className="hidden sm:inline">
                    {session.user.nickName}
                  </span>
                  <ChevronDown className="h-5 w-5 text-blue-200" />
                </MenuButton>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <div className="border-b border-gray-200 px-4 py-3">
                      <p className="text-sm font-semibold text-gray-900">
                        {session.user.fullName}
                      </p>
                      <p className="truncate text-sm text-gray-500">
                        {session.user.email}
                      </p>
                    </div>
                    {session.user.role === "BUYER" &&
                      pages.map((page) => (
                        <MenuItem key={page.name}>
                          <Link
                            href={page.href}
                            className="block px-4 py-2 text-sm text-gray-700 ui-active:bg-gray-100"
                          >
                            {page.name}
                          </Link>
                        </MenuItem>
                      ))}
                    {isOrganizer === false && session.user.role === "BUYER" ? (
                      <MenuItem>
                        <Link
                          href="/join-organizer"
                          className="block w-full px-4 py-2 text-left text-sm font-semibold text-blue-600 ui-active:bg-gray-100 ui-active:text-blue-700"
                        >
                          Join Organizer
                        </Link>
                      </MenuItem>
                    ) : null}

                    {isOrganizer === true && session.user.role === "BUYER" ? (
                      <MenuItem>
                        <Link
                          href="/organizer"
                          className="block w-full px-4 py-2 text-left text-sm font-semibold text-blue-600 ui-active:bg-gray-100 ui-active:text-blue-700"
                        >
                          Organizer Dashboard
                        </Link>
                      </MenuItem>
                    ) : null}

                    {session.user.role === "ADMIN" && (
                      <MenuItem>
                        <Link
                          href="/admin"
                          className="block w-full px-4 py-2 text-left text-sm font-semibold text-blue-600 ui-active:bg-gray-100 ui-active:text-blue-700"
                        >
                          Admin Dashboard
                        </Link>
                      </MenuItem>
                    )}
                    <MenuItem>
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="block w-full px-4 py-2 text-left text-sm text-red-700 ui-active:bg-red-50 ui-active:text-red-800"
                      >
                        Logout
                      </button>
                    </MenuItem>
                  </div>
                </MenuItems>
              </Transition>
            </Menu>
          ) : (
            <div className="flex items-center gap-x-2">
              <Link
                href="/login"
                className="rounded-md px-3.5 py-2 text-sm font-semibold text-white ring-1 ring-inset ring-white/50 hover:bg-blue-700"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-white px-3.5 py-2 text-sm font-semibold text-blue-600 shadow-sm hover:bg-blue-50"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default NavbarFront;
