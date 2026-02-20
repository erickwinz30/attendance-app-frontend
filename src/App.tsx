import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import HistoryPage from "./pages/HistoryPage";
import UsersPage from "./pages/UsersPage";
import UserDetailPage from "./pages/UserDetailPage";
import ScannerPage from "./pages/ScannerPage";
import LoginPage from "./pages/LoginPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import ProtectedRoute from "./components/ProtectedRoute";
import HRDRoute from "./components/HRDRoute";
import ScannerRoute from "./components/ScannerRoute";
import NonAdminRoute from "./components/NonAdminRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Route tanpa sidebar */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Route dengan sidebar */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50 flex">
                <Sidebar />
                <div className="flex-1 ml-64">
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <NonAdminRoute>
                          <HomePage />
                        </NonAdminRoute>
                      }
                    />
                    <Route
                      path="/dashboard"
                      element={
                        <HRDRoute>
                          <DashboardPage />
                        </HRDRoute>
                      }
                    />
                    <Route
                      path="/history"
                      element={
                        <HRDRoute>
                          <HistoryPage />
                        </HRDRoute>
                      }
                    />
                    <Route
                      path="/users"
                      element={
                        <HRDRoute>
                          <UsersPage />
                        </HRDRoute>
                      }
                    />
                    <Route
                      path="/users/:userId"
                      element={
                        <HRDRoute>
                          <UserDetailPage />
                        </HRDRoute>
                      }
                    />
                    <Route
                      path="/scanner"
                      element={
                        <ScannerRoute>
                          <ScannerPage />
                        </ScannerRoute>
                      }
                    />
                  </Routes>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
