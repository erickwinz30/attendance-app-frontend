import { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

import { AttendanceResponse } from "../types/attendance";

export default function Scanner() {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const renderAttempted = useRef(false);

  useEffect(() => {
    // Skip if we already attempted to render
    // This ref persists across StrictMode's double invocation
    if (renderAttempted.current) {
      return;
    }

    const element = document.getElementById("qr-reader");
    if (!element) {
      console.error("QR reader element not found");
      return;
    }

    // Mark that we've attempted render - this persists even after cleanup
    renderAttempted.current = true;

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1,
      },
      false,
    );

    const onScanSuccess = (decodedText: string) => {
      const qrData: AttendanceResponse = JSON.parse(decodedText);
      console.log("QR ditemukan:", qrData);
      // TODO: parse dan kirim ke backend
    };

    const onScanError = (errorMessage: string) => {
      // Error ini umum terjadi saat kamera mencari QR
      // Bisa diabaikan atau log seperlunya
    };

    scanner.render(onScanSuccess, onScanError);
    scannerRef.current = scanner;

    return () => {
      // Cleanup: clear scanner but DON'T reset renderAttempted
      // This ensures we won't double-render in StrictMode
      if (scannerRef.current) {
        scannerRef.current
          .clear()
          .then(() => {
            console.log("Scanner cleared successfully");
          })
          .catch((error) => {
            console.error("Error clearing scanner:", error);
          })
          .finally(() => {
            scannerRef.current = null;
          });
      }
    };
  }, []);

  return (
    <div className="w-full flex justify-center">
      <div className="qr-scanner-frame w-full max-w-md">
        <div id="qr-reader" className="qr-reader" />
      </div>
    </div>
  );
}
