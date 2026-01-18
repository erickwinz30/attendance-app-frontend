import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";
import { Home, History, Users, QrCode } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

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
      <div className="p-4 border-t border-white/20">
        <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
          <p className="text-xs text-white/70">Version 1.0.0</p>
          <p className="text-xs text-white/50 mt-1">© 2026 Attendance App</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
