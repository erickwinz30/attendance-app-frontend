import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Clock,
  CheckCircle,
  User,
  Briefcase,
  Calendar,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  XCircle,
  Users,
} from "lucide-react";
import { getTodayAttendance, getMonthlyAttendance } from "../lib/attendance";
import {
  TodayAttendanceResponse,
  MonthlyAttendanceResponse,
} from "../types/attendance";

const HistoryPage = () => {
  const [filterType, setFilterType] = useState<"today" | "monthly">("today");
  const [todayData, setTodayData] = useState<TodayAttendanceResponse | null>(
    null,
  );
  const [monthlyData, setMonthlyData] =
    useState<MonthlyAttendanceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 200;

  // Get current data based on filter
  const currentData = filterType === "today" ? todayData : monthlyData;
  const allAttendances = currentData?.attendances || [];

  // Calculate pagination
  const totalPages = Math.ceil(allAttendances.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAttendances = allAttendances.slice(startIndex, endIndex);

  // Fetch today's attendance data
  const fetchTodayAttendance = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTodayAttendance();
      setTodayData(data);
      console.log("Today attendance data:", data);
    } catch (err) {
      console.error("Failed to fetch today attendance:", err);
      setError("Gagal memuat data absensi hari ini");
    } finally {
      setLoading(false);
    }
  };

  // Fetch monthly attendance data
  const fetchMonthlyAttendance = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMonthlyAttendance();
      setMonthlyData(data);
      console.log("Monthly attendance data:", data);
    } catch (err) {
      console.error("Failed to fetch monthly attendance:", err);
      setError("Gagal memuat data absensi bulanan");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchTodayAttendance();
  }, []);

  // Handle filter change
  const handleFilterChange = async (type: "today" | "monthly") => {
    setFilterType(type);
    setCurrentPage(1); // Reset to first page

    if (type === "today" && !todayData) {
      await fetchTodayAttendance();
    } else if (type === "monthly" && !monthlyData) {
      await fetchMonthlyAttendance();
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Format time from ISO string to HH:MM:SS (UTC time from backend)
  const formatTime = (isoString: string): string => {
    const date = new Date(isoString);
    // Use UTC methods to show the original time from backend
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    const seconds = date.getUTCSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  // Format date from ISO string
  const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Get month name in Indonesian
  const getMonthName = (monthStr: string): string => {
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    const monthIndex = parseInt(monthStr) - 1;
    return months[monthIndex] || "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            History Absensi
          </h1>
          <p className="text-gray-600">Riwayat kehadiran karyawan</p>
          {currentData && (
            <p className="text-sm text-gray-500 mt-1">
              {filterType === "today" &&
                todayData &&
                formatDate(todayData.date)}
              {filterType === "monthly" &&
                monthlyData &&
                `${getMonthName(monthlyData.month)} ${monthlyData.year}`}
            </p>
          )}
        </div>

        {/* Filter Tabs */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Button
                variant={filterType === "today" ? "default" : "outline"}
                onClick={() => handleFilterChange("today")}
                className="flex-1"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Hari Ini
              </Button>
              <Button
                variant={filterType === "monthly" ? "default" : "outline"}
                onClick={() => handleFilterChange("monthly")}
                className="flex-1"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Bulanan
              </Button>
            </div>
          </CardContent>
        </Card>

        {loading && (
          <Card>
            <CardContent className="p-8">
              <div className="text-center">
                <p className="text-gray-600">Memuat data...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card>
            <CardContent className="p-8">
              <div className="text-center">
                <p className="text-red-600">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {!loading && !error && currentData && (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Total Hadir
                    </CardTitle>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-600">
                    {currentData.total_attend}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Telat
                    </CardTitle>
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-yellow-600">
                    {currentData.total_late}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Tidak Hadir
                    </CardTitle>
                    <XCircle className="w-5 h-5 text-red-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-red-600">
                    {currentData.total_absent}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Total Karyawan
                    </CardTitle>
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">
                    {currentData.total_attend + currentData.total_absent}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* History Table */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Daftar Kehadiran</CardTitle>
                <CardDescription>
                  {allAttendances.length === 0
                    ? "Belum ada data"
                    : `Halaman ${currentPage} dari ${totalPages} (${allAttendances.length} total data)`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            Nama
                          </div>
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                          Email
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                          <div className="flex items-center">
                            <Briefcase className="w-4 h-4 mr-1" />
                            Departemen
                          </div>
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                          Posisi
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            Waktu Check-in
                          </div>
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedAttendances.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="py-8 text-center text-gray-500"
                          >
                            Belum ada data absensi
                          </td>
                        </tr>
                      ) : (
                        paginatedAttendances.map((record) => (
                          <tr
                            key={record.user_id}
                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                          >
                            <td className="py-3 px-4 text-sm font-medium text-gray-900">
                              {record.user_name}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">
                              {record.user_email}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">
                              {record.department_name}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">
                              {record.position}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">
                              {formatTime(record.check_in_time)}
                            </td>
                            <td className="py-3 px-4">
                              {record.is_used ? (
                                record.status === "late" ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    <AlertCircle className="w-3 h-3 mr-1" />
                                    Telat
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Hadir
                                  </span>
                                )
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  Pending
                                </span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Halaman {currentPage} dari {totalPages}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </Button>

                      {/* Page numbers */}
                      <div className="flex gap-1">
                        {Array.from(
                          { length: Math.min(5, totalPages) },
                          (_, i) => {
                            let pageNum: number;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }

                            return (
                              <Button
                                key={pageNum}
                                variant={
                                  currentPage === pageNum
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() => handlePageChange(pageNum)}
                                className="min-w-[40px]"
                              >
                                {pageNum}
                              </Button>
                            );
                          },
                        )}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Absent Users Table */}
            {currentData.absent_users &&
              currentData.absent_users.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-red-600" />
                      Daftar Karyawan Tidak Hadir
                    </CardTitle>
                    <CardDescription>
                      {currentData.absent_users.length} karyawan tidak hadir{" "}
                      {filterType === "today" ? "hari ini" : "bulan ini"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                              <div className="flex items-center">
                                <User className="w-4 h-4 mr-1" />
                                Nama
                              </div>
                            </th>
                            <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                              Email
                            </th>
                            <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                              <div className="flex items-center">
                                <Briefcase className="w-4 h-4 mr-1" />
                                Departemen
                              </div>
                            </th>
                            <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                              Posisi
                            </th>
                            <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentData.absent_users.map((user) => (
                            <tr
                              key={user.user_id}
                              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                            >
                              <td className="py-3 px-4 text-sm font-medium text-gray-900">
                                {user.user_name}
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-600">
                                {user.user_email}
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-600">
                                {user.department_name}
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-600">
                                {user.position}
                              </td>
                              <td className="py-3 px-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Tidak Hadir
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}
          </>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
