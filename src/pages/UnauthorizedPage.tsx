import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ShieldX, ArrowLeft } from "lucide-react";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <ShieldX className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-gray-900">
            Akses Ditolak
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-gray-700 font-medium">
              Anda tidak memiliki izin untuk mengakses halaman ini.
            </p>
            <p className="text-sm text-gray-600">
              Halaman ini hanya dapat diakses oleh pengguna dengan role HRD.
            </p>
          </div>

          <div className="pt-4">
            <Button onClick={() => navigate("/")} className="w-full" size="lg">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Home
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Jika Anda merasa ini adalah kesalahan, silakan hubungi
              administrator.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnauthorizedPage;
