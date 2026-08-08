# Progres Proyek - MEMORY.md

File ini digunakan untuk melacak riwayat pengembangan, fitur yang telah diimplementasikan, dan langkah selanjutnya dalam proyek **Borneo Journey**.

---

## 📅 Riwayat Milestone Pengembangan

### Milestone 1: Fondasi Desain & Pencarian Tiket (Selesai)
- Membuat struktur semantik HTML5 dan sistem CSS terpadu (Design Tokens, HSL colors, responsive grid).
- Membangun antarmuka pencarian tiket shuttle antarkota.
- Membangun peta interaktif SVG pelacakan rute armada shuttle travel di Kalimantan.
- Menambahkan asisten chatbot digital untuk FAQ umum.

### Milestone 2: Form Pemesanan & Alur Checkout (Selesai)
- Membangun modal pemesanan tiket 2-step yang ringkas (Detail Penumpang & Checkout Pembayaran).
- Menghapus alur pemilihan kursi (bypassed) sesuai keputusan admin.
- Mengintegrasikan metode pembayaran digital modern (e-Wallet: GoPay/OVO/DANA/QRIS dan Bank Virtual Account: BCA/Mandiri/BNI).
- Membatasi preferensi notifikasi murni hanya ke **WhatsApp Saja** (menghilangkan SMS).

### Milestone 3: Fitur Otentikasi & Dashboard Admin (Selesai)
- Membuka modal login role-based untuk Pelanggan dan Admin.
- Mendukung login Pelanggan via **Nomor WhatsApp atau Email** (`081234567890` atau `pelanggan@mail.com` password `user123`).
- Menyediakan profil pelanggan terintegrasi yang dapat diperbarui namanya/NIK-nya.
- Membangun CRUD Dashboard Admin:
  - **Kelola Jadwal:** Form tambah/edit jadwal keberangkatan bus HiAce.
  - **Kelola Rute & Kota:** Tambah/hapus kota dinamis yang langsung sinkron ke seluruh dropdown form pencarian.
  - **Atur Harga Rute & Simulasi:** Matriks harga dasar rute perjalanan + Kalkulator simulasi harga real-time (Harga Dasar + Peak Markup/Discount Event = Harga Final).
  - **Pengaturan Harga Event:** Mengaktifkan markup/diskon musiman bersyarat tanggal (misal: Libur Lebaran +20%).
  - **Kelola Ulasan:** Menghapus ulasan/review pelanggan.

### Milestone 4: Generator Fallback Jadwal Otomatis (Selesai)
- Membuat generator jadwal otomatis on-the-fly jika rute yang dicari kosong. Menjamin **jadwal selalu ada** untuk seluruh kombinasi rute.
- Durasi perjalanan otomatis menyesuaikan jarak tempuh Kalimantan (3.5 jam vs 6.5 jam).
- Menambahkan banner dan tombol WhatsApp Admin di halaman jadwal jika user membutuhkan request charter khusus.

---

## 📌 Status Terakhir Proyek
- **Kondisi Kode Lokal:** Stabil dan semua fitur SPA berjalan tanpa bug/error di sisi klien.
- **Penyimpanan Lokal:** State jadwal, ulasan, kota, event, dan riwayat pesanan disimpan secara persisten di `localStorage`.
- **Target Integrasi Cloud:** Menghubungkan ke GitHub, hosting di Vercel, dan migrasi local-state ke cloud database Supabase.

---

## 🔮 Rencana Langkah Selanjutnya (Next Steps)
1. **GitHub Repository Setup:** Inisialisasi git dan push ke repositori GitHub.
2. **Hosting Vercel:** Menghubungkan repositori ke Vercel untuk deployment otomatis (CI/CD).
3. **Database Supabase:**
   - Membuat skema tabel (tables) di Supabase untuk `schedules`, `cities`, `pricing_events`, `bookings`, dan `reviews`.
   - Mengganti state local storage di `app.js` dengan query fetch/insert Supabase API Client.
4. **Supabase Auth:** Mengintegrasikan registrasi & login otentikasi nyata menggunakan Supabase Auth (Email OTP atau WA Link).
