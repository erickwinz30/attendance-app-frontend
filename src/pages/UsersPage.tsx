import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select } from "../components/ui/select";
import {
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  CheckCircle,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { allUsers, allDepartments, createUser, updateUser } from "../lib/user";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  position: string;
  department_id: number;
  department_name: string;
  status: string;
  created_at: string;
}

interface Department {
  id: number;
  name: string;
}

type CreateUserData = {
  name: string;
  email: string;
  phone: string;
  position: string;
  department_id: number;
  status: string;
};

const UsersPage = () => {
  const navigate = useNavigate();

  // state for mounted data
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  //state for create user form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");
  const [departmentId, setDepartmentId] = useState<number | "">("");
  const [status, setStatus] = useState("active");

  // state for edit user
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editPosition, setEditPosition] = useState("");
  const [editDepartmentId, setEditDepartmentId] = useState<number | "">("");
  const [editStatus, setEditStatus] = useState("active");

  // search state
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  //function untuk fetch user data
  const fetchUsers = async () => {
    const data = await allUsers();
    setUsers(data);
    setFilteredUsers(data);
    console.log("Fetched users:", data);
  };

  //function untuk fetch department data
  const fetchDepartments = async () => {
    const data = await allDepartments();
    setDepartments(data);

    console.log("Fetched departments:", data);
  };

  useEffect(() => {
    fetchUsers();
    fetchDepartments();
  }, []); // Empty array = hanya run sekali saat mount

  // Effect untuk filter users berdasarkan debouncedSearchQuery
  useEffect(() => {
    if (debouncedSearchQuery === "") {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter((user) => {
      return (
        user.name.toLowerCase().includes(debouncedSearchQuery) ||
        user.email.toLowerCase().includes(debouncedSearchQuery) ||
        user.position.toLowerCase().includes(debouncedSearchQuery) ||
        user.department_name.toLowerCase().includes(debouncedSearchQuery)
      );
    });

    setFilteredUsers(filtered);
  }, [debouncedSearchQuery, users]);

  // Cleanup timeout saat component unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchQuery(value);
    setCurrentPage(1); // Reset ke halaman pertama saat query berubah

    // Clear previous timeout
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timeout untuk debounce
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchQuery(value);
    }, 300);
  };

  const handleSubmitCreateUser = async () => {
    const formData: CreateUserData = {
      name,
      email,
      phone,
      position,
      department_id: Number(departmentId),
      status,
    };

    try {
      const submitResult = await createUser(formData);
      console.log(submitResult);

      if (submitResult === "success") {
        fetchUsers(); // Refresh user list
        setIsModalOpen(false); // Close modal

        // Reset form fields
        setName("");
        setEmail("");
        setPhone("");
        setPosition("");
        setDepartmentId("");
        setStatus("active");

        // Show success alert
        setSuccessMessage("User baru berhasil ditambahkan ke sistem");
        setShowSuccessAlert(true);

        // Auto hide after 3 seconds
        setTimeout(() => {
          setShowSuccessAlert(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleEdit = (user: User) => {
    setEditUserId(user.id);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditPhone(user.phone);
    setEditPosition(user.position);
    setEditDepartmentId(user.department_id);
    setEditStatus(user.status);
    setIsEditModalOpen(true);
  };

  const handleSubmitEditUser = async () => {
    if (!editUserId) return;

    const formData: CreateUserData = {
      name: editName,
      email: editEmail,
      phone: editPhone,
      position: editPosition,
      department_id: Number(editDepartmentId),
      status: editStatus,
    };

    try {
      const submitResult = await updateUser(editUserId, formData);
      console.log(submitResult);

      if (submitResult === "success") {
        fetchUsers(); // Refresh user list
        setIsEditModalOpen(false); // Close modal

        // Reset form fields
        setEditUserId(null);
        setEditName("");
        setEditEmail("");
        setEditPhone("");
        setEditPosition("");
        setEditDepartmentId("");
        setEditStatus("active");

        // Show success alert
        setSuccessMessage("Data user berhasil diperbarui");
        setShowSuccessAlert(true);

        // Auto hide after 3 seconds
        setTimeout(() => {
          setShowSuccessAlert(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 py-8">
      {/* Success Alert */}
      {showSuccessAlert && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-5">
          <div className="bg-white rounded-lg shadow-lg border border-green-200 p-4 flex items-start gap-3 max-w-md">
            <div className="flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Berhasil!</h3>
              <p className="text-sm text-gray-600 mt-1">{successMessage}</p>
            </div>
            <button
              onClick={() => setShowSuccessAlert(false)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

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
          <Button size="lg" onClick={() => setIsModalOpen(true)}>
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
                {new Set(users.map((u) => u.department_name)).size}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Cari karyawan berdasarkan nama, email, posisi, atau departemen..."
                  value={searchQuery}
                  onChange={(e) => handleSearchQueryChange(e)}
                  className="pl-10 pr-4 py-2 w-full text-base"
                />
              </div>
              {searchQuery && (
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Menampilkan hasil pencarian untuk:{" "}
                    <span className="font-semibold">"{searchQuery}"</span>
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleSearchQueryChange({
                        // target value set ke kosong agar awal kosong
                        target: { value: "" },
                      } as React.ChangeEvent<HTMLInputElement>)
                    }
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
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
                  <span>{user.department_name}</span>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => navigate(`/users/${user.id}`)}
                  >
                    Detail
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* kondisi untuk no results */}
          {filteredUsers.length === 0 && (
            <div>Tidak ada hasil yang ditemukan...</div>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-8 mb-4">
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Menampilkan{" "}
                  <span className="font-semibold">
                    {Math.min(
                      (currentPage - 1) * itemsPerPage + 1,
                      filteredUsers.length,
                    )}
                  </span>{" "}
                  -{" "}
                  <span className="font-semibold">
                    {Math.min(currentPage * itemsPerPage, filteredUsers.length)}
                  </span>{" "}
                  dari{" "}
                  <span className="font-semibold">{filteredUsers.length}</span>{" "}
                  user
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from(
                      {
                        length: Math.ceil(filteredUsers.length / itemsPerPage),
                      },
                      (_, i) => i + 1,
                    )
                      .filter((page) => {
                        // Show first page, last page, current page, and pages around current
                        const totalPages = Math.ceil(
                          filteredUsers.length / itemsPerPage,
                        );
                        return (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        );
                      })
                      .map((page, index, array) => (
                        <React.Fragment key={page}>
                          {index > 0 && array[index - 1] !== page - 1 && (
                            <span className="px-2 text-gray-400">...</span>
                          )}
                          <Button
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="min-w-[40px]"
                          >
                            {page}
                          </Button>
                        </React.Fragment>
                      ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(
                          Math.ceil(filteredUsers.length / itemsPerPage),
                          prev + 1,
                        ),
                      )
                    }
                    disabled={
                      currentPage ===
                      Math.ceil(filteredUsers.length / itemsPerPage)
                    }
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add User Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah User Baru</DialogTitle>
            <DialogDescription>
              Isi form di bawah ini untuk menambahkan user baru ke sistem
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input
                id="name"
                placeholder="Masukkan nama lengkap"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@email.com"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">No. Telepon</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="08xxxxxxxxxx"
                onChange={(e) => setPhone(e.target.value)}
                value={phone}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Posisi/Jabatan</Label>
              <Input
                id="position"
                placeholder="Contoh: Software Engineer"
                onChange={(e) => setPosition(e.target.value)}
                value={position}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Departemen</Label>
              <Select
                id="department"
                onChange={(e) => setDepartmentId(Number(e.target.value))}
                value={departmentId}
              >
                <option value="">Pilih Departemen</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                id="status"
                onChange={(e) => setStatus(e.target.value)}
                value={status}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={() => {
                handleSubmitCreateUser();
              }}
            >
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Data User</DialogTitle>
            <DialogDescription>
              Perbarui informasi user di bawah ini
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nama Lengkap</Label>
              <Input
                id="edit-name"
                placeholder="Masukkan nama lengkap"
                onChange={(e) => setEditName(e.target.value)}
                value={editName}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="nama@email.com"
                onChange={(e) => setEditEmail(e.target.value)}
                value={editEmail}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-phone">No. Telepon</Label>
              <Input
                id="edit-phone"
                type="tel"
                placeholder="08xxxxxxxxxx"
                onChange={(e) => setEditPhone(e.target.value)}
                value={editPhone}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-position">Posisi/Jabatan</Label>
              <Input
                id="edit-position"
                placeholder="Contoh: Software Engineer"
                onChange={(e) => setEditPosition(e.target.value)}
                value={editPosition}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-department">Departemen</Label>
              <Select
                id="edit-department"
                onChange={(e) => setEditDepartmentId(Number(e.target.value))}
                value={editDepartmentId}
              >
                <option value="">Pilih Departemen</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                id="edit-status"
                onChange={(e) => setEditStatus(e.target.value)}
                value={editStatus}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={() => {
                handleSubmitEditUser();
              }}
            >
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersPage;
