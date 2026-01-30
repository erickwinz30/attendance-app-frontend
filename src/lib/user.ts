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

export const allUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch("/api/users");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data: User[] = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }
};
