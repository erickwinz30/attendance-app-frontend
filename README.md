# Attendance App - Frontend

Aplikasi frontend untuk sistem manajemen absensi berbasis QR Code menggunakan React, TypeScript, dan Tailwind CSS.

## ✨ Fitur Utama

- QR Code Generator & Scanner untuk absensi
- Dashboard riwayat absensi dengan filter
- User management (CRUD)
- Authentication & role-based access control (Admin, HRD, User)
- Responsive design dengan UI modern
- Real-time attendance tracking

## 🛠 Tech Stack

- React 19.2.3 + TypeScript
- React Router DOM 7.12.0
- Tailwind CSS 3.4.17
- Axios untuk API calls
- html5-qrcode & qrcode libraries
- shadcn/ui components

## 📦 Prerequisites

- Node.js >= 16.x
- pnpm >= 8.x (atau npm)

## 🚀 Installation & Running

```bash
# Install dependencies
pnpm install

# Run development server (http://localhost:3000)
pnpm start

# Build for production
pnpm run build

# Run tests
pnpm test
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components (button, card, dialog, input, etc.)
│   ├── Navbar.tsx      # Navigation bar
│   ├── Sidebar.tsx     # Side navigation
│   ├── Scanner.tsx     # QR scanner component
│   ├── QRGenerator.tsx # QR code generator
│   └── *Route.tsx      # Route guards (Protected, NonAdmin, HRD, Scanner)
├── pages/              # Page components
│   ├── LoginPage.tsx
│   ├── HomePage.tsx    # Dashboard
│   ├── ScannerPage.tsx
│   ├── HistoryPage.tsx
│   ├── UsersPage.tsx
│   ├── UserDetailPage.tsx
│   └── UnauthorizedPage.tsx
├── lib/                # Utilities & API services
│   ├── authentication.ts
│   ├── attendance.ts
│   ├── user.ts
│   └── utils.ts
├── types/              # TypeScript types
└── App.tsx             # Main app with routing
```

## 🔐 Pages & Routes

- **`/login`** - Login page
- **`/`** - Dashboard (protected)
- **`/scanner`** - QR code scanner (Scanner role)
- **`/history`** - Attendance history (protected)
- **`/users`** - User management (Admin/HRD)
- **`/users/:id`** - User detail (Admin/HRD)
- **`/unauthorized`** - Access denied page
