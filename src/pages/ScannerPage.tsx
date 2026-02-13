import React, { useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Camera,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import Scanner from "../components/Scanner";

interface ScanResult {
  success: boolean;
  message: string;
  type: "success" | "error" | "late" | "already_used" | "expired" | "invalid";
  data?: any;
}

const ScannerPage = () => {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);

  const handleScanResult = useCallback((result: ScanResult) => {
    setScanResult(result);
    // Auto hide after 5 seconds
    setTimeout(() => {
      setScanResult(null);
    }, 5000);
  }, []);

  const getResultStyle = (type: ScanResult["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "late":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "already_used":
        return "bg-orange-50 border-orange-200 text-orange-800";
      case "expired":
        return "bg-purple-50 border-purple-200 text-purple-800";
      case "error":
      case "invalid":
        return "bg-red-50 border-red-200 text-red-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  const getResultIcon = (type: ScanResult["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-8 h-8 text-green-600" />;
      case "late":
        return <Clock className="w-8 h-8 text-yellow-600" />;
      case "already_used":
        return <AlertTriangle className="w-8 h-8 text-orange-600" />;
      case "expired":
        return <Clock className="w-8 h-8 text-purple-600" />;
      case "error":
      case "invalid":
        return <XCircle className="w-8 h-8 text-red-600" />;
      default:
        return <AlertCircle className="w-8 h-8 text-gray-600" />;
    }
  };
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-3">
            <Camera className="w-12 h-12 text-primary" />
            <h1 className="text-4xl font-bold text-gray-800">QR Scanner</h1>
          </div>
          <p className="text-gray-600">
            Scan QR code untuk mencatat kehadiran karyawan
          </p>
        </div>

        {/* Scanner Card */}
        <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-primary to-blue-600 text-white">
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-6 h-6" />
              Scanner Aktif
            </CardTitle>
            <CardDescription className="text-white/80">
              Arahkan kamera ke QR code untuk scan
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Result Message */}
              {scanResult && (
                <div
                  className={`p-5 rounded-lg border-2 ${getResultStyle(scanResult.type)} animate-in fade-in slide-in-from-top-2 duration-300`}
                >
                  <div className="flex items-start gap-4">
                    {getResultIcon(scanResult.type)}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">
                        {scanResult.type === "success" && "✓ Absensi Berhasil!"}
                        {scanResult.type === "late" && "⏰ Terlambat"}
                        {scanResult.type === "already_used" &&
                          "⚠️ Sudah Digunakan"}
                        {scanResult.type === "expired" && "⏱️ QR Code Expired"}
                        {(scanResult.type === "error" ||
                          scanResult.type === "invalid") &&
                          "✗ Gagal"}
                      </h3>
                      <p className="text-base">{scanResult.message}</p>
                      {scanResult.data?.user_id && (
                        <p className="text-xs mt-1 opacity-75">
                          User ID: {scanResult.data.user_id}
                        </p>
                      )}
                      <p className="text-xs mt-1 opacity-75">
                        {new Date().toLocaleString("id-ID", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* QR Reader Container */}
              <Scanner onScanResult={handleScanResult} />

              {/* Instructions */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Petunjuk Penggunaan:
                </h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Pastikan QR code terlihat jelas di layar</li>
                  <li>• Jaga jarak kamera sekitar 15-20 cm dari QR code</li>
                  <li>• QR code akan otomatis terdeteksi</li>
                  <li>• Tunggu konfirmasi setelah scan berhasil</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              Informasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Scanner ini hanya dapat digunakan oleh user dengan akses scanner.
              Pastikan QR code yang di-scan masih valid dan belum expired.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScannerPage;
