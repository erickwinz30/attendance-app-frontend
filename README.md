# Attendance App - Frontend

![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-3178C6?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-06B6D4?style=flat&logo=tailwindcss)

Aplikasi frontend untuk sistem manajemen absensi berbasis QR Code yang dibangun dengan React, TypeScript, dan Tailwind CSS.

## 📋 Daftar Isi

- [Fitur](#fitur)
- [Teknologi](#teknologi)
- [Prasyarat](#prasyarat)
- [Instalasi](#instalasi)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [Struktur Folder](#struktur-folder)
- [Halaman Utama](#halaman-utama)
- [Komponen UI](#komponen-ui)

## ✨ Fitur

- 🎨 **UI Modern** - Desain clean dengan Tailwind CSS dan shadcn/ui components
- 📱 **Responsive Design** - Tampilan optimal di desktop, tablet, dan mobile
- 🔄 **SPA Navigation** - React Router untuk navigasi smooth tanpa reload
- 🎯 **QR Code Scanner** - Interface untuk scan QR absensi
- 📊 **History Dashboard** - Riwayat absensi dengan filter dan tabel
- 👥 **User Management** - Kelola daftar user dengan card layout
- 🎨 **Sidebar Navigation** - Navigasi sidebar di sebelah kiri
- ⚡ **Fast Development** - Hot reload dengan React Scripts

## 🛠 Teknologi

### Core

- **React** 19.2.3 - Library UI
- **TypeScript** 4.9.5 - Type safety
- **React Router DOM** 7.12.0 - Client-side routing

### Styling

- **Tailwind CSS** 3.4.17 - Utility-first CSS framework
- **class-variance-authority** - Component variants
- **clsx** & **tailwind-merge** - Conditional className utilities

### UI Components

- **lucide-react** - Icon library
- Custom shadcn/ui components (Button, Card)

### Development

- **React Scripts** 5.0.1 - Build tooling
- **PostCSS** & **Autoprefixer** - CSS processing

## 📦 Prasyarat

Pastikan Anda telah menginstall:

- **Node.js** >= 16.x
- **npm** >= 8.x atau **pnpm** >= 8.x
- **Git**

## 🚀 Instalasi

1. **Clone repository**

   ```bash
   git clone <repository-url>
   cd attendance-app/frontend
   ```

2. **Install dependencies**

   Menggunakan npm:

   ```bash
   npm install
   ```

   Atau menggunakan pnpm:

   ```bash
   pnpm install
   ```

## 🏃 Menjalankan Aplikasi

### Development Mode

```bash
npm start
# atau
pnpm start
```

Aplikasi akan berjalan di [http://localhost:3000](http://localhost:3000)

### Build untuk Production

```bash
npm run build
# atau
pnpm run build
```

Build output akan berada di folder `build/`

### Menjalankan Tests

```bash
npm test
# atau
pnpm test
```

## 📁 Struktur Folder

```
frontend/
├── public/                 # File static
│   ├── index.html         # HTML template
│   ├── manifest.json      # PWA manifest
│   └── robots.txt         # SEO robots
├── src/
│   ├── components/        # Komponen React
│   │   ├── ui/           # UI components (Button, Card)
│   │   ├── Sidebar.tsx   # Sidebar navigation
│   │   └── Navbar.tsx    # Navbar (deprecated)
│   ├── pages/            # Page components
│   │   ├── HomePage.tsx      # Halaman scan QR
│   │   ├── HistoryPage.tsx   # Halaman history
│   │   └── UsersPage.tsx     # Halaman user list
│   ├── lib/              # Utility functions
│   │   └── utils.ts      # Helper functions
│   ├── App.tsx           # Root component
│   ├── App.css           # App styles
│   ├── index.tsx         # Entry point
│   └── index.css         # Global styles + Tailwind
├── tailwind.config.js    # Tailwind configuration
├── postcss.config.js     # PostCSS configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies & scripts
```

## 📄 Halaman Utama

### 1. **Home Page** (`/`)

- **Fitur**: Scan QR code untuk absensi
- **Komponen**:
  - QR Scanner interface dengan simulasi
  - Real-time feedback saat scanning
  - Status keberhasilan scan
  - Statistik quick view (Total, Hadir, Tidak Hadir)

### 2. **History Page** (`/history`)

- **Fitur**: Riwayat absensi semua user
- **Komponen**:
  - Filter berdasarkan status (Semua, Hadir, Tidak Hadir)
  - Tabel dengan data tanggal, waktu, dan status
  - Badge status dengan icon
  - Statistik total records
  - Format tanggal Indonesia

### 3. **Users Page** (`/users`)

- **Fitur**: Daftar dan manajemen user
- **Komponen**:
  - Card grid layout untuk setiap user
  - Informasi lengkap (nama, email, phone, posisi, departemen)
  - Status badge (active/inactive)
  - Action buttons (Edit, Detail)
  - Statistik: Total Users, Active, Inactive, Departments

## 🎨 Komponen UI

### Button Component

```tsx
import { Button } from "./components/ui/button";

<Button variant="default">Click Me</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button size="lg">Large Button</Button>
```

**Variants**: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`
**Sizes**: `default`, `sm`, `lg`, `icon`

### Card Component

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
</Card>;
```

## 🔧 Konfigurasi

### Proxy Backend

Backend proxy dikonfigurasi di `package.json`:

```json
{
  "proxy": "http://localhost:8080"
}
```

API calls ke `/api/*` akan otomatis di-proxy ke backend server di port 8080.

### Tailwind Configuration

Custom colors dan theme di `tailwind.config.js` menggunakan CSS variables untuk mendukung dark mode.

## 🎯 Pengembangan Selanjutnya

- [ ] Integrasi dengan backend API
- [ ] Implementasi real QR code scanner (camera access)
- [ ] Authentication & Authorization
- [ ] Real-time updates dengan WebSocket
- [ ] Export data absensi (PDF, Excel)
- [ ] Dark mode toggle
- [ ] Notifications & Alerts
- [ ] PWA support (offline mode)
- [ ] Multi-language support (i18n)

## 📝 Catatan

- Aplikasi ini masih dalam tahap **pembelajaran/development**
- Data yang ditampilkan adalah **dummy data** untuk preview UI
- QR Scanner saat ini hanya **simulasi**, belum menggunakan camera real
- Belum ada integrasi dengan backend API

## 🤝 Kontribusi

Silakan buat issue atau pull request untuk kontribusi atau perbaikan.

## 📄 License

MIT License - bebas digunakan untuk pembelajaran dan pengembangan.

---

**Dibuat dengan ❤️ menggunakan React & Tailwind CSS**
