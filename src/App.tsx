import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/HomePage";
import HistoryPage from "./pages/HistoryPage";
import UsersPage from "./pages/UsersPage";
import LoginPage from "./pages/LoginPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import ProtectedRoute from "./components/ProtectedRoute";
import HRDRoute from "./components/HRDRoute";

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
                    <Route path="/" element={<HomePage />} />
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
