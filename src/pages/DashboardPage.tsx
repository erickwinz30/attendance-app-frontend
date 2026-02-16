import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Users, UserCheck, UserX, BarChart3 } from "lucide-react";

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <BarChart3 className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
          </div>
          <p className="text-gray-600">Statistik Kehadiran Karyawan Hari Ini</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium text-gray-600">
                  Total Karyawan
                </CardTitle>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-primary">42</p>
              <p className="text-xs text-gray-500 mt-2">
                Total karyawan terdaftar
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium text-gray-600">
                  Hadir
                </CardTitle>
                <UserCheck className="w-8 h-8 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-green-600">38</p>
              <p className="text-xs text-gray-500 mt-2">
                Karyawan yang hadir hari ini
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium text-gray-600">
                  Tidak Hadir
                </CardTitle>
                <UserX className="w-8 h-8 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-red-600">4</p>
              <p className="text-xs text-gray-500 mt-2">
                Karyawan yang tidak hadir
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
