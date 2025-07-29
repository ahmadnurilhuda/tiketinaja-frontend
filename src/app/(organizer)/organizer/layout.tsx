import SidebarOrganizer from "./components/SidebarOrganizer";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen">
      <SidebarOrganizer />
      <main className="flex-1 bg-gray-50 ml-64">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}