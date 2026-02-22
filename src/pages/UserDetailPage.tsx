import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  ArrowLeft,
  Mail,
  MapPin,
  Briefcase,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone,
  Shield,
  Plus,
} from "lucide-react";
import { getUser } from "../lib/user";
import { getUserAttendance } from "../lib/attendance";

import { User } from "../types/user";
import { UserAttendanceResponse } from "../types/attendance";

const UserDetailPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<User | null>(null);
  const [userAttendanceData, setUserAttendanceData] =
    useState<UserAttendanceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State untuk month dan year
  const [selectedMonth, setSelectedMonth] = useState<number>(0);
  const [selectedYear, setSelectedYear] = useState<number>(0);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const data = await getUser(parseInt(userId));
        setUserData(data);
      } catch (err) {
        setError("Gagal memuat data user");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  // Set default month dan year saat component mount, dan fetch initial data
  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    setSelectedMonth(currentMonth);
    setSelectedYear(currentYear);

    // Fetch initial data
    const fetchInitialData = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        setError(null);
        const data = await getUserAttendance(
          parseInt(userId),
          currentMonth,
          currentYear,
        );
        setUserAttendanceData(data);
      } catch (err) {
        setError("Gagal memuat data kehadiran user");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [userId]);

  // Fetch attendance data berdasarkan month dan year (dipanggil manual)
  const fetchUserAttendanceData = async () => {
    if (!userId || !selectedMonth || !selectedYear) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getUserAttendance(
        parseInt(userId),
        selectedMonth,
        selectedYear,
      );
      setUserAttendanceData(data);
    } catch (err) {
      setError("Gagal memuat data kehadiran user");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "on-time":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Tepat Waktu
          </span>
        );
      case "late":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            Telat
          </span>
        );
      case "absent":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Tidak Hadir
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "-";
    const time = new Date(timeString);
    return time.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCreatedDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusDisplay = (status: string) => {
    if (status === "active") {
      return (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-green-700 font-medium">Aktif</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span className="text-red-700 font-medium">Tidak Aktif</span>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <Button
            variant="outline"
            onClick={() => navigate("/users")}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-red-600">{error || "Data tidak ditemukan"}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const attendanceStats = {
    total: userAttendanceData?.attendances?.length || 0,
    present: userAttendanceData?.total_present || 0,
    late:
      userAttendanceData?.attendances?.filter((a) => a.status === "late")
        .length || 0,
    absent: userAttendanceData?.total_absent || 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => navigate("/users")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Daftar User
        </Button>

        {/* User Info Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Detail Karyawan</CardTitle>
            <CardDescription>Informasi lengkap karyawan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900">
                    {userData.name}
                  </h3>
                </div>
                <div className="flex items-start text-gray-600">
                  <Mail className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="break-all">{userData.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span>{userData.phone}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Briefcase className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span>{userData.position}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span>{userData.department_name}</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-5 h-5 mr-3 flex-shrink-0" />
                  {getStatusDisplay(userData.status)}
                </div>
                <div className="flex items-center text-gray-600">
                  <Plus className="w-5 h-5 mr-3 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">
                      Bergabung pada
                    </span>
                    <span className="font-medium">
                      {formatCreatedDate(userData.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Hari
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">
                {attendanceStats.total}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Hadir Tepat Waktu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">
                {attendanceStats.present}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Telat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-600">
                {attendanceStats.late}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Tidak Hadir
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">
                {attendanceStats.absent}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Attendance History */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Riwayat Absensi</CardTitle>
                <CardDescription>
                  Daftar lengkap kehadiran karyawan
                </CardDescription>
              </div>
              <div className="flex flex-wrap items-end gap-3">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Bulan
                  </label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value={1}>Januari</option>
                    <option value={2}>Februari</option>
                    <option value={3}>Maret</option>
                    <option value={4}>April</option>
                    <option value={5}>Mei</option>
                    <option value={6}>Juni</option>
                    <option value={7}>Juli</option>
                    <option value={8}>Agustus</option>
                    <option value={9}>September</option>
                    <option value={10}>Oktober</option>
                    <option value={11}>November</option>
                    <option value={12}>Desember</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Tahun
                  </label>
                  <input
                    type="number"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    min="2020"
                    max="2030"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary w-28"
                  />
                </div>
                <Button
                  onClick={fetchUserAttendanceData}
                  disabled={loading || !selectedMonth || !selectedYear}
                  className="px-6"
                >
                  {loading ? "Loading..." : "Tampilkan"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {!userAttendanceData ||
            !userAttendanceData.attendances ||
            userAttendanceData.attendances.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Belum ada data absensi
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          Tanggal
                        </div>
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          Waktu Check In
                        </div>
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {userAttendanceData.attendances.map((attendance, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          {formatDate(attendance.date)}
                        </td>
                        <td className="py-4 px-4">
                          {formatTime(attendance.check_in_time)}
                        </td>
                        <td className="py-4 px-4">
                          {getStatusBadge(attendance.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDetailPage;
