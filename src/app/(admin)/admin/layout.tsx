
import SidebarAdmin from "./components/SidebarAdmin";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen">
      <SidebarAdmin />
      <main className="flex-1 bg-gray-50 ml-64">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
