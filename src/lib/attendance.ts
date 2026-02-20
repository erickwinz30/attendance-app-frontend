import axios from "axios";
import {
  CheckAttendanceRequest,
  GenerateAttendanceResponse,
  WorkHours,
  TodayAttendanceResponse,
  MonthlyAttendanceResponse,
  UserAttendanceResponse,
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

export const getWorkHours = async (): Promise<WorkHours> => {
  try {
    const response = await axios.get("/api/work-hours");
    return response.data;
  } catch (error) {
    console.error("Error fetching work hours:", error);
    throw new Error("Gagal mengambil data jam kerja");
  }
};

export const getTodayAttendance =
  async (): Promise<TodayAttendanceResponse> => {
    try {
      const response = await axios.get("/api/attendance/today");
      return response.data;
    } catch (error) {
      console.error("Error fetching today attendance:", error);
      throw new Error("Gagal mengambil data absensi hari ini");
    }
  };

export const getMonthlyAttendance =
  async (): Promise<MonthlyAttendanceResponse> => {
    try {
      const response = await axios.get("/api/attendance/monthly");
      return response.data;
    } catch (error) {
      console.error("Error fetching monthly attendance:", error);
      throw new Error("Gagal mengambil data absensi bulanan");
    }
  };

export const getUserAttendance = async (
  userId: number,
  month: number,
  year: number,
): Promise<UserAttendanceResponse> => {
  try {
    const response = await axios.get(
      `/api/attendance/employee/monthly?user_id=${userId}&month=${month}&year=${year}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user attendance:", error);
    throw new Error("Gagal mengambil data absensi user");
  }
};
