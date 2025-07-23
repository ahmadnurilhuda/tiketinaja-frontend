export default async function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
  return (
    <>
      <main className="min-h-screen bg-gray-50">
        {children}
      </main>
    </>
  );
}
