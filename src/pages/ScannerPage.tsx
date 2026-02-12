import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Camera, AlertCircle } from "lucide-react";
import Scanner from "../components/Scanner";

const ScannerPage = () => {
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
              {/* QR Reader Container */}
              <Scanner />

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
