import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { QrCode, Camera, CheckCircle2, Clock } from "lucide-react";
import {
  AttendanceResponse,
  CheckAttendanceRequest,
} from "../types/attendance";

import {
  generateAttendanceToken,
  checkAttendanceToken,
} from "../lib/attendance";
import QRGenerator from "../components/QRGenerator";
import { request } from "http";

const HomePage = () => {
  const [generating, setGenerating] = useState(false);
  const [generatedQR, setGeneratedQR] = useState<AttendanceResponse | null>(
    null,
  );
  const [checking, setChecking] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  // Format waktu menjadi MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const tokenData: AttendanceResponse = await generateAttendanceToken();
      console.log("Generated attendance token data:", tokenData);

      // Simpan ke localStorage
      localStorage.setItem("attendanceToken", JSON.stringify(tokenData));
      setGeneratedQR(tokenData);
    } catch (error) {
      console.error("Failed to generate attendance token:", error);
    } finally {
      setGenerating(false);
    }
  };

  // Timer countdown effect
  useEffect(() => {
    if (!generatedQR) return;

    const calculateTimeRemaining = () => {
      const expiredAt = new Date(generatedQR.expired_at).getTime();
      const now = new Date().getTime();
      const remaining = Math.floor((expiredAt - now) / 1000); // dalam detik
      return remaining > 0 ? remaining : 0;
    };

    // Set initial time
    setTimeRemaining(calculateTimeRemaining());

    // Update setiap detik
    const interval = setInterval(() => {
      const remaining = calculateTimeRemaining();
      setTimeRemaining(remaining);

      // Jika sudah expired, clear state
      if (remaining <= 0) {
        setGeneratedQR(null);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [generatedQR]);

  // Check existing token on mount
  useEffect(() => {
    const checkExistingToken = async () => {
      setChecking(true);
      setGeneratedQR(null); // Reset dulu sebelum cek

      try {
        const storedToken = localStorage.getItem("attendanceToken");

        if (!storedToken) {
          console.log("No stored token found");
          setChecking(false);
          return;
        }

        const tokenData: AttendanceResponse = JSON.parse(storedToken);
        console.log("Found stored token:", tokenData);

        const requestData: CheckAttendanceRequest = {
          user_id: tokenData.user_id,
          token: tokenData.token,
        };

        const response = await checkAttendanceToken(requestData);
        console.log("Token check response:", response);

        if (response.valid) {
          setGeneratedQR(tokenData);
          console.log("Token is still valid, restored from storage");
        } else {
          localStorage.removeItem("attendanceToken");
          console.log("Token invalid:", response.message);
        }
      } catch (error) {
        console.error("Error checking existing token:", error);
        localStorage.removeItem("attendanceToken");
      } finally {
        setChecking(false);
      }
    };

    checkExistingToken();
  }, []);

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
              {checking || generating ? (
                <div className="animate-pulse text-center">
                  <QrCode className="w-16 h-16 text-primary mx-auto" />
                  <p className="text-sm text-gray-600 mt-2">
                    {checking ? "Checking..." : "Generating..."}
                  </p>
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

            {!generating && !generatedQR && (
              <Button size="lg" onClick={handleGenerate} className="w-full">
                <QrCode className="w-5 h-5 mr-2" />
                Generate QR Code
              </Button>
            )}

            {generatedQR && (
              <div className="w-full space-y-2">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-green-800">
                    QR Code berhasil dibuat!
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-green-600">
                      Waktu: {new Date().toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>

                {/* Timer Countdown */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <p className="text-sm font-medium text-blue-800">
                        Berlaku hingga
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-blue-600 font-mono">
                      {formatTime(timeRemaining)}
                    </p>
                  </div>
                  {timeRemaining <= 60 && timeRemaining > 0 && (
                    <p className="text-xs text-red-600 mt-2 text-center">
                      ⚠️ QR Code akan segera expired!
                    </p>
                  )}
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
