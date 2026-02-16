import React, { useState, useCallback, useEffect } from "react";
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
import { getWorkHours } from "../lib/attendance";
import { WorkHours } from "../types/attendance";

interface ScanResult {
  success: boolean;
  message: string;
  type: "success" | "error" | "late" | "already_used" | "expired" | "invalid";
  data?: any;
}

const ScannerPage = () => {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [workHours, setWorkHours] = useState<WorkHours | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeStatus, setTimeStatus] = useState<
    "before_work" | "tolerance" | "late" | "on_time"
  >("before_work");

  const handleScanResult = useCallback((result: ScanResult) => {
    setScanResult(result);
    // Auto hide after 5 seconds
    setTimeout(() => {
      setScanResult(null);
    }, 5000);
  }, []);

  // Format time string (HH:MM:SS) to (HH:MM)
  const formatTimeString = (timeStr: string): string => {
    if (!timeStr) return "";

    // Handle ISO timestamp format (0000-01-01T08:15:00Z) or similar
    if (timeStr.includes("T")) {
      const timePart = timeStr.split("T")[1];
      const parts = timePart.split(":");
      if (parts.length >= 2) {
        return `${parts[0]}:${parts[1]}`;
      }
    }

    // Handle HH:MM:SS format
    const parts = timeStr.split(":");
    if (parts.length >= 2) {
      return `${parts[0]}:${parts[1]}`;
    }

    return timeStr;
  };

  // Fetch work hours on mount
  useEffect(() => {
    const fetchWorkHours = async () => {
      try {
        const data = await getWorkHours();
        setWorkHours(data);
        console.log("Work hours fetched:", data);
      } catch (error) {
        console.error("Failed to fetch work hours:", error);
      }
    };

    fetchWorkHours();
  }, []);

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Calculate time status
  useEffect(() => {
    if (!workHours) return;

    const now = new Date();
    const currentTimeStr = now.toTimeString().split(" ")[0]; // HH:MM:SS format

    // Extract time part only from work hours (handle both HH:MM:SS and ISO timestamp format)
    const extractTime = (timeStr: string): string => {
      if (timeStr.includes("T")) {
        return timeStr.split("T")[1].split("Z")[0];
      }
      return timeStr;
    };

    const workStart = extractTime(workHours.work_start_time);
    const toleranceTime = extractTime(workHours.tolerance_time);

    if (currentTimeStr < workStart) {
      setTimeStatus("before_work");
    } else if (currentTimeStr >= workStart && currentTimeStr <= toleranceTime) {
      setTimeStatus("tolerance");
    } else if (currentTimeStr > toleranceTime) {
      setTimeStatus("late");
    }
  }, [currentTime, workHours]);

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
              {/* Time Status Banner */}
              {workHours && timeStatus !== "before_work" && (
                <div
                  className={`p-4 rounded-lg border-2 ${
                    timeStatus === "tolerance"
                      ? "bg-yellow-50 border-yellow-200"
                      : "bg-red-50 border-red-200"
                  } animate-in fade-in duration-300`}
                >
                  <div className="flex items-center gap-3">
                    {timeStatus === "tolerance" ? (
                      <AlertTriangle className="w-8 h-8 text-yellow-600" />
                    ) : (
                      <Clock className="w-8 h-8 text-red-600" />
                    )}
                    <div className="flex-1">
                      <h3
                        className={`text-lg font-bold ${
                          timeStatus === "tolerance"
                            ? "text-yellow-800"
                            : "text-red-800"
                        }`}
                      >
                        {timeStatus === "tolerance"
                          ? "⚠️ Masa Toleransi"
                          : "❌ Anda Terlambat"}
                      </h3>
                      <p
                        className={`text-sm ${
                          timeStatus === "tolerance"
                            ? "text-yellow-700"
                            : "text-red-700"
                        }`}
                      >
                        {timeStatus === "tolerance"
                          ? `Jam kerja dimulai pukul ${formatTimeString(workHours.work_start_time)}, Anda masih dalam waktu toleransi hingga ${formatTimeString(workHours.tolerance_time)}`
                          : `Batas waktu toleransi (${formatTimeString(workHours.tolerance_time)}) telah terlewati. Anda datang terlambat.`}
                      </p>
                      <p
                        className={`text-xs mt-2 font-mono font-bold ${
                          timeStatus === "tolerance"
                            ? "text-yellow-800"
                            : "text-red-800"
                        }`}
                      >
                        Waktu saat ini:{" "}
                        {currentTime.toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              )}

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
