# Borneo Journey - Panduan Utama Proyek

Selamat datang di repositori utama **Borneo Journey** (branded as **BorneoJourney**), platform shuttle travel premium modern yang menghubungkan berbagai kota dan wilayah di Kalimantan Selatan dan Kalimantan Tengah secara praktis, nyaman, dan aman.

---

## 🚀 Teknologi yang Digunakan
1. **Frontend Core:** HTML5 (Struktur Semantik) & Vanilla CSS3 (Desain Responsif, Modern Glassmorphism, Theme Tokens).
2. **Logic Engine:** Vanilla Javascript (SPA Routing, State Management, Kalkulator Simulasi Harga, CRUD Driver/Admin).
3. **Database & Auth (Rencana Integrasi):** Supabase (Penyimpanan data rute, jadwal keberangkatan, ulasan, riwayat transaksi, serta Auth akun).
4. **Hosting & Deployment:** Vercel (Hosting statis handal & cepat).
5. **Version Control:** GitHub (Manajemen kode sumber & integrasi Vercel CI/CD).

---

## 📁 Struktur Folder Proyek
```text
borneo-journey/
├── assets/
│   ├── css/
│   │   └── styles.css      # Custom design tokens, layout grid, modals, & animations
│   ├── js/
│   │   └── app.js          # SPA Engine, CRUD Logic, pricing calculators, & Auth
│   └── images/
│       ├── hero-bg.jpg     # Visual assets rute dan latar belakang
│       ├── banjarmasin.jpg
│       ├── palangkaraya.jpg
│       └── banjarbaru-sampit.jpg
├── index.html              # Main HTML entry file
├── borneo-journey.md       # Panduan utama proyek (file ini)
└── MEMORY.md               # Log pencatatan progres & riwayat modifikasi
```

---

## ✨ Fitur Utama
1. **Pemesanan Tiket 2-Step Seamless:** Formulir identitas penumpang lengkap dengan preferensi notifikasi terintegrasi murni via WhatsApp Saja (tanpa SMS) dilanjutkan dengan simulasi pembayaran digital (e-Wallet dan Virtual Account Bank).
2. **Dashboard Administrator:**
   - **Kelola Jadwal:** Menambah, memperbarui, dan menghapus jadwal keberangkatan bus HiAce.
   - **Kelola Rute & Kota:** Menambah rute kota baru secara dinamis yang otomatis memperbarui seluruh pilihan dropdown di web.
   - **Atur Harga & Simulasi (Kalkulator Harga):** Manajemen harga dasar rute perjalanan serta simulator kalkulasi harga (Harga Dasar + Peak Markup/Discount Event = Harga Final Penumpang).
   - **Pengaturan Harga Event:** Mengatur markup/diskon musiman (seperti Libur Lebaran +20%) untuk tanggal tertentu dengan tanda badge merah khusus.
   - **Kelola Ulasan:** Memantau dan menghapus ulasan masukan dari pelanggan.
3. **Generator Jadwal Fallback Otomatis:** Menjamin jadwal perjalanan selalu tersedia untuk rute mana pun yang dicari pelanggan dengan membuat jadwal pagi (08:30) & sore (16:00) secara dinamis.
4. **Pelacakan Posisi Armada:** Peta interaktif SVG Kalimantan dengan animasi pergerakan armada shuttle secara real-time.
5. **Support Chatbot Assistant:** Asisten digital chatbot untuk menjawab pertanyaan umum terkait jadwal, tarif, dan pemesanan.

---

## 💻 Cara Menjalankan Secara Lokal
Untuk menjalankan server lokal, Anda bisa menggunakan modul `serve` dari Node:
```bash
npx serve
```
Buka browser dan akses **http://localhost:3000** (atau port yang diberikan oleh terminal).

---

## 🌐 Panduan Hubungan & Deploy ke Cloud

### 1. Hubungkan ke GitHub
- Buat repositori baru di GitHub bernama `borneo-journey`.
- Jalankan perintah berikut di folder proyek lokal Anda:
  ```bash
  git init
  git add .
  git commit -m "Initial commit - Borneo Journey"
  git branch -M main
  git remote add origin https://github.com/USERNAME/borneo-journey.git
  git push -u origin main
  ```

### 2. Deploy ke Vercel
- Hubungkan akun Vercel Anda dengan repositori GitHub `borneo-journey`.
- Vercel akan secara otomatis mendeteksi proyek statis ini dan langsung mendeploy-nya. Setiap kali Anda melakukan push ke `main`, Vercel akan mengupdate web secara otomatis.

### 3. Integrasi Supabase (Berikutnya)
- Buat proyek baru di dashboard Supabase.
- Hubungkan data di `app.js` menggunakan Supabase JS client API dengan memanfaatkan URL proyek dan Anon Key Anda.
