import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Calendar, Clock, CheckCircle, XCircle, Filter } from "lucide-react";

interface AttendanceRecord {
  id: number;
  name: string;
  date: string;
  time: string;
  status: "hadir" | "tidak-hadir";
}

const HistoryPage = () => {
  const [filter, setFilter] = useState<"all" | "hadir" | "tidak-hadir">("all");

  // Data dummy untuk history
  const [attendanceData] = useState<AttendanceRecord[]>([
    {
      id: 1,
      name: "Ahmad Fauzi",
      date: "2026-01-19",
      time: "08:15:30",
      status: "hadir",
    },
    {
      id: 2,
      name: "Siti Nurhaliza",
      date: "2026-01-19",
      time: "08:20:15",
      status: "hadir",
    },
    {
      id: 3,
      name: "Budi Santoso",
      date: "2026-01-19",
      time: "09:30:45",
      status: "hadir",
    },
    {
      id: 4,
      name: "Rina Wijaya",
      date: "2026-01-18",
      time: "-",
      status: "tidak-hadir",
    },
    {
      id: 5,
      name: "Dewi Lestari",
      date: "2026-01-18",
      time: "08:10:20",
      status: "hadir",
    },
    {
      id: 6,
      name: "Andi Pratama",
      date: "2026-01-18",
      time: "08:25:50",
      status: "hadir",
    },
    {
      id: 7,
      name: "Maya Sari",
      date: "2026-01-17",
      time: "-",
      status: "tidak-hadir",
    },
    {
      id: 8,
      name: "Rudi Hermawan",
      date: "2026-01-17",
      time: "08:05:10",
      status: "hadir",
    },
  ]);

  const filteredData = attendanceData.filter((record) =>
    filter === "all" ? true : record.status === filter,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            History Absensi
          </h1>
          <p className="text-gray-600">Riwayat kehadiran semua karyawan</p>
        </div>

        {/* Filter Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                onClick={() => setFilter("all")}
              >
                Semua
              </Button>
              <Button
                variant={filter === "hadir" ? "default" : "outline"}
                onClick={() => setFilter("hadir")}
              >
                Hadir
              </Button>
              <Button
                variant={filter === "tidak-hadir" ? "default" : "outline"}
                onClick={() => setFilter("tidak-hadir")}
              >
                Tidak Hadir
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">
                {attendanceData.length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Hadir
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">
                {attendanceData.filter((r) => r.status === "hadir").length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Tidak Hadir
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">
                {
                  attendanceData.filter((r) => r.status === "tidak-hadir")
                    .length
                }
              </p>
            </CardContent>
          </Card>
        </div>

        {/* History Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Absensi</CardTitle>
            <CardDescription>
              Menampilkan {filteredData.length} dari {attendanceData.length}{" "}
              records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                      Nama
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Tanggal
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        Waktu
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((record) => (
                    <tr
                      key={record.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        {record.name}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(record.date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {record.time}
                      </td>
                      <td className="py-3 px-4">
                        {record.status === "hadir" ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Hadir
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <XCircle className="w-3 h-3 mr-1" />
                            Tidak Hadir
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HistoryPage;
