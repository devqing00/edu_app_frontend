export type Role = "student" | "admin";

export type User = {
  id: string;
  email: string;
  name?: string | null;
  role: Role;
  is_active: boolean;
};

export type Course = {
  id: string;
  title?: string | null;
  code: number;
  capacity: number;
  is_active: boolean;
};

export type Enrollment = {
  id: string;
  user_id?: string;
  course_id: string;
  created_at: string;
};

export type TokenResponse = {
  access_token: string;
  token_type: string;
};
