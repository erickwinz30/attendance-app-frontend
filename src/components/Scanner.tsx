import { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

import { GenerateAttendanceResponse } from "../types/attendance";
import { submitAttendance } from "../lib/attendance";

interface ScannerProps {
  onScanResult?: (result: {
    success: boolean;
    message: string;
    type: "success" | "error" | "late" | "already_used" | "expired" | "invalid";
    data?: any;
  }) => void;
}

export default function Scanner({ onScanResult }: ScannerProps) {
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

    const onScanSuccess = async (decodedText: string) => {
      try {
        const qrData: GenerateAttendanceResponse = JSON.parse(decodedText);
        console.log("QR ditemukan:", qrData);

        // Pause scanner sementara saat memproses
        if (scannerRef.current) {
          await scannerRef.current.pause();
        }

        try {
          const response = await submitAttendance(qrData);
          console.log("Backend response:", response);

          // Determine response type based on backend response
          let resultType:
            | "success"
            | "late"
            | "already_used"
            | "expired"
            | "error" = "success";
          let message = "Absensi berhasil dicatat!";

          if (response.success === false) {
            // Handle error responses from backend
            const msg = response.message?.toLowerCase() || "";

            if (
              msg.includes("already used") ||
              msg.includes("sudah digunakan")
            ) {
              resultType = "already_used";
              message = "QR code ini sudah pernah digunakan untuk absensi.";
            } else if (msg.includes("expired") || msg.includes("kadaluarsa")) {
              resultType = "expired";
              message = "QR code sudah expired. Silakan generate QR code baru.";
            } else {
              resultType = "error";
              message = response.message || "Gagal mencatat absensi.";
            }
          } else {
            // Success response
            resultType = "success";
            message = "Absensi berhasil dicatat!";

            // Check if there's additional info (like late)
            const msg = response.message?.toLowerCase() || "";
            if (msg.includes("late") || msg.includes("telat")) {
              resultType = "late";
              message = "Anda terlambat, tetapi absensi telah dicatat.";
            }
          }

          if (onScanResult) {
            onScanResult({
              success: response.success === true,
              message: message,
              type: resultType,
              data: response,
            });
          }

          // Resume scanner after 3 seconds
          setTimeout(() => {
            if (scannerRef.current) {
              scannerRef.current.resume();
            }
          }, 3000);
        } catch (error: any) {
          console.error("Error submitting attendance:", error);
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Gagal mengirim absensi.";

          if (onScanResult) {
            onScanResult({
              success: false,
              message: errorMessage,
              type: "error",
            });
          }

          // Resume scanner after error
          setTimeout(() => {
            if (scannerRef.current) {
              scannerRef.current.resume();
            }
          }, 3000);
        }
      } catch (parseError) {
        console.error("Error parsing QR data:", parseError);
        if (onScanResult) {
          onScanResult({
            success: false,
            message: "QR code tidak valid atau format salah.",
            type: "invalid",
          });
        }

        // Resume scanner
        setTimeout(() => {
          if (scannerRef.current) {
            scannerRef.current.resume();
          }
        }, 3000);
      }
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
  }, [onScanResult]);

  return (
    <div className="w-full flex justify-center">
      <div className="qr-scanner-frame w-full max-w-md">
        <div id="qr-reader" className="qr-reader" />
      </div>
    </div>
  );
}
