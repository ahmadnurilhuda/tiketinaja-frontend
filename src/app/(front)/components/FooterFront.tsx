import React from "react";

export default function FooterFront() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-lg font-bold">Tiketinaja</p>
        <p className="mt-2 text-base text-gray-400">
          Platform terpercaya untuk semua kebutuhan event Anda.
        </p>
        <p className="mt-8 text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Tiketinaja. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
