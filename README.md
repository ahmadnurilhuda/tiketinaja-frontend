# Tiketinaja Frontend

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

Selamat datang di repositori frontend untuk **Tiketinaja**, sebuah platform manajemen dan penjualan tiket event modern yang dibangun dengan Next.js dan TypeScript.

## 📋 Daftar Isi

- [Tentang Proyek](#tentang-proyek)
- [Fitur Utama](#fitur-utama)
- [Dibangun Dengan](#dibangun-dengan)
- [Memulai](#memulai)
  - [Prasyarat](#prasyarat)
  - [Instalasi](#instalasi)
  - [Variabel Lingkungan](#variabel-lingkungan)
- [Struktur Folder](#struktur-folder)

---

## 🚀 Tentang Proyek

**Tiketinaja** adalah aplikasi web full-stack yang dirancang untuk memfasilitasi pembuatan, pengelolaan, dan pembelian tiket event secara online. Proyek ini dibagi menjadi tiga peran utama: **Admin**, **Organizer**, dan **Buyer**, masing-masing dengan dashboard dan fungsionalitasnya sendiri.

Arsitektur frontend ini menggunakan Next.js App Router, memanfaatkan Server Components untuk data fetching yang efisien dan Client Components untuk interaktivitas yang kaya.

---

## ✨ Fitur Utama

-   **Otentikasi Pengguna**: Sistem registrasi, verifikasi email, dan login yang aman menggunakan NextAuth.js.
-   **Tiga Peran Pengguna**:
    -   👤 **Buyer**: Menjelajahi event, melakukan pemesanan, dan melihat riwayat tiket & transaksi.
    -   🏢 **Organizer**: Mendaftar sebagai organizer, membuat dan mengelola event, serta menentukan jenis dan harga tiket.
    -   👑 **Admin**: Mengelola data master seperti kategori event dan memantau aktivitas platform.
-   **Pencarian & Filter Event**: Halaman publik dengan fitur pencarian dan filter multi-kriteria (judul, lokasi, kategori).
-   **Manajemen Data Asinkron**: Pengambilan dan mutasi data yang efisien dan andal menggunakan TanStack Query (React Query).
-   **Formulir Interaktif**: Validasi form di sisi klien yang kuat menggunakan Formik dan Yup.
-   **Desain Responsif**: Antarmuka yang modern dan responsif dibangun dengan Tailwind CSS.

---

## 🛠️ Dibangun Dengan

Berikut adalah teknologi utama yang digunakan dalam proyek ini:

-   **Framework**: [Next.js](https://nextjs.org/) (App Router)
-   **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Manajemen State Asinkron**: [TanStack Query (React Query)](https://tanstack.com/query/latest)
-   **Manajemen Form**: [Formik](https://formik.org/) & [Yup](https://github.com/jquense/yup)
-   **Otentikasi**: [NextAuth.js](https://next-auth.js.org/)
-   **HTTP Client**: [Axios](https://axios-http.com/)
-   **Komponen UI**: [Headless UI](https://headlessui.com/)
-   **Ikon**: [Lucide React](https://lucide.dev/)

---

## 🏁 Memulai

Untuk menjalankan proyek ini di lingkungan lokal Anda, ikuti langkah-langkah berikut.

### Prasyarat

Pastikan Anda sudah menginstal Node.js (versi 18.x atau lebih tinggi) dan package manager (npm atau yarn).

-   Node.js
    ```sh
    node -v
    ```
-   npm
    ```sh
    npm -v
    ```

### Instalasi

1.  **Clone repositori ini:**
    ```bash
    git clone [https://github.com/ahmadnurilhuda/tiketinaja-frontend.git](https://github.com/ahmadnurilhuda/tiketinaja-frontend.git)
    cd tiketinaja-frontend
    ```

2.  **Install dependensi:**
    ```bash
    npm install
    ```
    _atau jika menggunakan yarn:_
    ```bash
    yarn install
    ```

3.  **Jalankan server development:**
    ```bash
    npm run dev
    ```

4.  Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

### Variabel Lingkungan

Buat file `.env.local` di direktori utama proyek dan tambahkan variabel berikut. Pastikan backend sudah berjalan.

```env
# URL lengkap ke server backend Anda
NEXT_PUBLIC_BACKEND_URL=http://localhost:9988

# URL aplikasi frontend Anda (untuk NextAuth)
NEXTAUTH_URL=http://localhost:3000

# Kunci rahasia untuk NextAuth (buat kunci acak Anda sendiri)
# Jalankan `openssl rand -base64 32` di terminal untuk membuatnya
NEXTAUTH_SECRET=kunci-rahasia-anda-yang-sangat-panjang

📁 Struktur Folder
Proyek ini menggunakan App Router dari Next.js. Berikut adalah gambaran umum struktur folder utamanya:

/app
├── (auth)              # Grup rute untuk halaman otentikasi (login, register)
├── (buyer)             # Grup rute untuk halaman khusus buyer (pesanan, tiket)
├── (front)             # Grup rute untuk halaman publik (homepage, detail event)
├── (organizer)         # Grup rute untuk dashboard organizer
├── (admin)             # Grup rute untuk dashboard admin
├── actions/            # Berisi semua Server Actions untuk mutasi data
├── api/                # Berisi route handler Next.js (cth: untuk NextAuth)
├── components/         # Komponen UI yang dapat digunakan kembali
├── config/             # Konfigurasi, seperti instance Axios
├── context/            # React Context Providers (cth: RegionalProvider)
└── types/              # Definisi tipe TypeScript (interface, type)
