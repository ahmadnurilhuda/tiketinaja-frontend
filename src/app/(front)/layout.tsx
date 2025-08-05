import NavbarFront from "./components/NavbarFront";

export default async function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
  return (
    <>
    <NavbarFront />
      <main className="min-h-screen bg-gray-50">
        {children}
      </main>
    </>
  );
}
