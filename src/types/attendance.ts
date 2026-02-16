export interface GenerateAttendanceResponse {
  user_id: number;
  token: string;
  expired_at: string;
}

export interface AttendanceResponse {
  user_id: number;
  token: string;
  expired_at: string;
  is_used: boolean;
  created_at: string;
}

export interface CheckAttendanceRequest {
  user_id: number;
  token: string;
}

export interface WorkHours {
  id: number;
  work_start_time: string;
  work_end_time: string;
  tolerance_time: string;
  created_at: string;
  updated_at: string;
}

export interface AttendanceRecord {
  user_id: number;
  user_name: string;
  user_email: string;
  department_name: string;
  position: string;
  check_in_time: string;
  token: string;
  is_used: boolean;
  status?: string; // "late" or "on_time"
}

export interface AbsentUser {
  user_id: number;
  user_name: string;
  user_email: string;
  department_name: string;
  position: string;
}

export interface TodayAttendanceResponse {
  date: string;
  total_attend: number;
  total_late: number;
  total_absent: number;
  attendances: AttendanceRecord[];
  absent_users: AbsentUser[];
}

export interface MonthlyAttendanceResponse {
  month: string;
  year: string;
  total_attend: number;
  total_late: number;
  total_absent: number;
  attendances: AttendanceRecord[];
  absent_users: AbsentUser[];
}
