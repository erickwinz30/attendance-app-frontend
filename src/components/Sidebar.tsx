import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";
import { Home, History, Users, QrCode, LogOut } from "lucide-react";
import { logout } from "../lib/authentication";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const result = await logout();
      if (result.success) {
        navigate("/login");
      } else {
        alert("Logout gagal. Silakan coba lagi.");
      }
    } catch (error) {
      alert("Terjadi kesalahan saat logout.");
    } finally {
      setIsLoggingOut(false);
      setShowLogoutDialog(false);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const navItems = [
    { path: "/", label: "Home", icon: Home, description: "Scan Absensi" },
    {
      path: "/history",
      label: "History",
      icon: History,
      description: "Riwayat Absensi",
    },
    { path: "/users", label: "Users", icon: Users, description: "Daftar User" },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-primary to-blue-700 text-white shadow-2xl flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
            <QrCode className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Attendance</h1>
            <p className="text-xs text-white/70">Management System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3">
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-4 py-3 rounded-lg transition-all duration-200 group",
                  isActive
                    ? "bg-white text-primary shadow-lg"
                    : "text-white/80 hover:bg-white/10 hover:text-white",
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 mr-3 transition-transform group-hover:scale-110",
                    isActive ? "text-primary" : "",
                  )}
                />
                <div className="flex-1">
                  <p
                    className={cn(
                      "font-medium text-sm",
                      isActive ? "text-primary" : "",
                    )}
                  >
                    {item.label}
                  </p>
                  <p
                    className={cn(
                      "text-xs",
                      isActive ? "text-primary/70" : "text-white/60",
                    )}
                  >
                    {item.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/20 space-y-3">
        {/* Logout Button */}
        <button
          onClick={handleLogoutClick}
          disabled={isLoggingOut}
          className="w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 bg-white/20 hover:bg-white/30 text-white border border-white/40 hover:border-white disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span className="font-medium text-sm">
            {isLoggingOut ? "Logging out..." : "Logout"}
          </span>
        </button>

        {/* Version Info */}
        <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
          <p className="text-xs text-white/70">Version 1.0.0</p>
          <p className="text-xs text-white/50 mt-1">© 2026 Attendance App</p>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Logout</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin keluar dari aplikasi? Anda harus login
              kembali untuk mengakses sistem.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLogoutDialog(false)}
              disabled={isLoggingOut}
              className="w-full sm:w-auto"
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full sm:w-auto"
            >
              {isLoggingOut ? "Logging out..." : "Ya, Logout"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sidebar;
