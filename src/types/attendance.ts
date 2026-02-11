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
