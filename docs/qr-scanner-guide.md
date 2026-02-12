# Panduan HTML5 QR Scanner

Dokumen ini menjelaskan cara menambahkan fitur scan QR menggunakan library `html5-qrcode` di project React ini.

## Prasyarat

- Browser modern (Chrome/Edge/Firefox/Safari terbaru)
- Izin akses kamera pada browser
- Dependency sudah terpasang: `html5-qrcode`

## Instalasi

Jika belum terpasang, jalankan:

```bash
pnpm add html5-qrcode
```

## Konsep Dasar

Library `html5-qrcode` menyediakan komponen scanner berbasis kamera. Alur sederhananya:

1. Siapkan elemen HTML sebagai container.
2. Inisialisasi `Html5QrcodeScanner`.
3. Daftarkan callback sukses dan error.
4. Render scanner ke container.
5. Bersihkan scanner saat komponen unmount.

## Contoh Implementasi di React

```tsx
import { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function ScannerDemo() {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      false,
    );

    const onScanSuccess = (decodedText: string) => {
      console.log("QR ditemukan:", decodedText);
      // TODO: parse dan kirim ke backend
    };

    const onScanError = (errorMessage: string) => {
      // Error ini umum terjadi saat kamera mencari QR
      // Bisa diabaikan atau log seperlunya
    };

    scanner.render(onScanSuccess, onScanError);
    scannerRef.current = scanner;

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
    };
  }, []);

  return <div id="qr-reader" />;
}
```

## Penjelasan Singkat Opsi

- `fps`: frekuensi pemindaian per detik (misal 10)
- `qrbox`: ukuran area scan dalam px
- `verbose`: jika `true` akan menampilkan log detail

## Tips Penggunaan

- Gunakan area scan (qrbox) agar kamera fokus pada area tertentu.
- Tampilkan pesan loading/processing saat QR terdeteksi.
- Setelah scan sukses, hentikan scanner dengan `clear()` jika tidak perlu scan lagi.

## Integrasi dengan Backend

Jika QR berisi JSON, Anda bisa parse lalu kirim ke API:

```ts
const onScanSuccess = async (decodedText: string) => {
  const qrData = JSON.parse(decodedText);
  await checkAttendanceToken({
    user_id: qrData.user_id,
    token: qrData.token,
  });
};
```

Pastikan validasi error untuk mencegah crash jika QR tidak valid.

## Troubleshooting

- Kamera tidak muncul: pastikan izin kamera diberikan di browser.
- Error berulang saat scan: normal, bisa diabaikan jika tidak ada QR.
- QR tidak terdeteksi: perbaiki pencahayaan dan jarak kamera.
