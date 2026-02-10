import axios from "axios";

// Set default config untuk semua request
axios.defaults.baseURL = "http://localhost:8080";
axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] = "application/json";

export const generateAttendanceToken = async () => {
  try {
    const response = await axios.get("/api/attendance/token");

    if (response.data && response.data.token) {
      return response.data;
    } else {
      throw new Error("Token tidak diterima dari server");
    }
  } catch (error) {
    console.error("Error generating attendance token:", error);
    throw new Error("Gagal membuat token absen");
  }
};
