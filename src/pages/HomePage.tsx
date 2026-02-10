import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { QrCode, Camera, CheckCircle2 } from "lucide-react";
import AttendanceResponse from "../types/AttendanceResponse";

import { generateAttendanceToken } from "../lib/attendance";
import QRGenerator from "../components/QRGenerator";

const HomePage = () => {
  const [generating, setGenerating] = useState(false);
  const [generatedQR, setGeneratedQR] = useState<AttendanceResponse | null>(
    null,
  );

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const tokenData: AttendanceResponse = await generateAttendanceToken();
      console.log("Generated attendance token data:", tokenData);

      setGeneratedQR(tokenData);
    } catch (error) {
      console.error("Failed to generate attendance token:", error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Generate QR Code
          </h1>
          <p className="text-gray-600">Buat QR code untuk absensi Anda</p>
        </div>

        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center">QR Code Generator</CardTitle>
            <CardDescription className="text-center">
              Klik tombol untuk membuat QR code
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-6">
            <div className="relative w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              {generating ? (
                <div className="animate-pulse">
                  <QrCode className="w-16 h-16 text-primary" />
                  <p className="text-sm text-gray-600 mt-2">Generating...</p>
                </div>
              ) : generatedQR ? (
                <QRGenerator data={generatedQR} />
              ) : (
                <div className="text-center">
                  <QrCode className="w-16 h-16 text-gray-400 mx-auto" />
                  <p className="text-sm text-gray-500 mt-2">
                    Belum ada QR code
                  </p>
                </div>
              )}
            </div>

            {!generating && (
              <Button size="lg" onClick={handleGenerate} className="w-full">
                <QrCode className="w-5 h-5 mr-2" />
                {generatedQR ? "Generate Ulang" : "Generate QR Code"}
              </Button>
            )}

            {generatedQR && (
              <div className="w-full space-y-2">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-green-800">
                    QR Code berhasil dibuat!
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Waktu: {new Date().toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Hari Ini
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">42</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Hadir
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">38</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Tidak Hadir
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">4</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
