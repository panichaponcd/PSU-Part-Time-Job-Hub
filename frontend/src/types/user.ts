export type UserRole = 'STUDENT' | 'ADMIN';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  is_staff: boolean;
  is_superuser: boolean;
}

export interface StudentProfile {
  id: number;
  user: number | User;
  first_name: string;
  last_name: string;
  student_id: string;
  faculty: string;
  major: string;
  phone_number?: string;
  religion?: string;
  allergies?: string;
  avatar_url?: string;
  student_card_image?: string | null;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}
