import axios from "axios";

// Set default config untuk semua request
// Gunakan relative URL agar proxy bisa handle routing
axios.defaults.baseURL = "";
axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] = "application/json";

export type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  position: string;
  department_id: number;
  department_name: string;
  status: string;
  created_at: string;
};

type Department = {
  id: number;
  name: string;
};

export type NewUser = {
  name: string;
  email: string;
  phone: string;
  position: string;
  department_id: number;
  status: string;
};

export const allUsers = async (): Promise<User[]> => {
  try {
    const response = await axios.get("/api/users");
    if (response.status !== 200) {
      throw new Error("Network response was not ok");
    }
    const data: User[] = response.data;
    return data;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }
};

export const allDepartments = async (): Promise<Department[]> => {
  try {
    const response = await axios.get("/api/departments");
    if (response.status !== 200) {
      throw new Error("Network response was not ok");
    }
    return response.data as Department[];
  } catch (error) {
    console.error("Failed to fetch departments:", error);
    return [];
  }
};

export const createUser = async (formData: NewUser): Promise<string> => {
  try {
    console.log("Creating user with data:", formData);
    const response = await axios.post("/api/users", formData);
    if (response.status === 201) {
      return "success";
    } else {
      return `Failed to create user: ${response.statusText}`;
    }
  } catch (error) {
    console.error("Failed to create user:", error);
    return "Failed to create user";
  }
};
