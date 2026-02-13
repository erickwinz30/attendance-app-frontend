import axios from "axios";
import {
  CheckAttendanceRequest,
  GenerateAttendanceResponse,
} from "../types/attendance";

// Set default config untuk semua request
// Gunakan relative URL agar proxy bisa handle routing
axios.defaults.baseURL = "";
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

export const checkAttendanceToken = async (data: CheckAttendanceRequest) => {
  try {
    const response = await axios.post("/api/attendance/token/check", data);
    return response.data;
  } catch (error) {
    console.error("Error checking attendance token:", error);
    throw new Error("Gagal memeriksa token absen");
  }
};

export const submitAttendance = async (data: GenerateAttendanceResponse) => {
  try {
    const response = await axios.post("/api/attendance/submit", data);
    return response.data;
  } catch (error) {
    console.error("Error submitting attendance:", error);
    throw new Error("Gagal mengirim data absen");
  }
};
