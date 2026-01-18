import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { UserPlus, Mail, Phone, MapPin, Briefcase } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  status: "active" | "inactive";
}

const UsersPage = () => {
  // Data dummy untuk users
  const [users] = useState<User[]>([
    {
      id: 1,
      name: "Ahmad Fauzi",
      email: "ahmad.fauzi@company.com",
      phone: "+62 812-3456-7890",
      position: "Software Engineer",
      department: "IT",
      status: "active",
    },
    {
      id: 2,
      name: "Siti Nurhaliza",
      email: "siti.nurhaliza@company.com",
      phone: "+62 813-4567-8901",
      position: "Product Manager",
      department: "Product",
      status: "active",
    },
    {
      id: 3,
      name: "Budi Santoso",
      email: "budi.santoso@company.com",
      phone: "+62 814-5678-9012",
      position: "UI/UX Designer",
      department: "Design",
      status: "active",
    },
    {
      id: 4,
      name: "Rina Wijaya",
      email: "rina.wijaya@company.com",
      phone: "+62 815-6789-0123",
      position: "HR Manager",
      department: "HR",
      status: "inactive",
    },
    {
      id: 5,
      name: "Dewi Lestari",
      email: "dewi.lestari@company.com",
      phone: "+62 816-7890-1234",
      position: "Marketing Specialist",
      department: "Marketing",
      status: "active",
    },
    {
      id: 6,
      name: "Andi Pratama",
      email: "andi.pratama@company.com",
      phone: "+62 817-8901-2345",
      position: "Backend Developer",
      department: "IT",
      status: "active",
    },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Daftar User
            </h1>
            <p className="text-gray-600">
              Kelola data karyawan dan pengguna sistem
            </p>
          </div>
          <Button size="lg">
            <UserPlus className="w-5 h-5 mr-2" />
            Tambah User
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{users.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Active
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">
                {users.filter((u) => u.status === "active").length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Inactive
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">
                {users.filter((u) => u.status === "inactive").length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Departments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">
                {new Set(users.map((u) => u.department)).size}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <Card key={user.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{user.name}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Briefcase className="w-3 h-3 mr-1" />
                      {user.position}
                    </CardDescription>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      user.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="break-all">{user.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>{user.department}</span>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Detail
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
