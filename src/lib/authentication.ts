import axios from "axios";

// Set default config untuk semua request
axios.defaults.baseURL = "http://localhost:8080";
axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] = "application/json";

type LoginResponse = {
  success: boolean;
  message?: string;
};

type AuthCheckResponse = {
  authenticated: boolean;
  user?: {
    id: number;
    name: string;
    email: string;
    is_hrd: boolean;
  };
};

export const login = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  try {
    const response = await axios.post("/api/login", { email, password });
    console.log("Login response data:", response);
    if (response.data.success) {
      return { success: true, message: "Login berhasil" };
    } else {
      return {
        success: false,
        message: response.data.message || "Login gagal",
      };
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Jika ada response dari server (4xx, 5xx)
      if (error.response) {
        return {
          success: false,
          message: error.response.data?.message || "Login gagal",
        };
      }
      // Jika network error atau timeout
      return {
        success: false,
        message: "Tidak dapat terhubung ke server",
      };
    }
    return { success: false, message: (error as Error).message };
  }
};

export const logout = async (): Promise<LoginResponse> => {
  try {
    const response = await axios.post("/api/logout");

    if (response.data.success) {
      return { success: true, message: "Logout berhasil" };
    } else {
      return {
        success: false,
        message: response.data.message || "Logout gagal",
      };
    }
  } catch (error) {
    console.error("Logout failed:", error);
    return { success: false, message: "Logout gagal" };
  }
};

export const checkAuthentication = async (): Promise<AuthCheckResponse> => {
  try {
    const response = await axios.get("/api/auth/check");

    if (response.data.authenticated) {
      return {
        authenticated: true,
        user: response.data.user,
      };
    } else {
      return { authenticated: false };
    }
  } catch (error) {
    console.error("Authentication check failed:", error);
    return { authenticated: false };
  }
};
