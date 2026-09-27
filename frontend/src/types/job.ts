import { StudentProfile } from './user';

export type JobType = 'INTERNAL' | 'EXTERNAL';
export type JobStatus = 'OPEN' | 'CLOSED' | 'IN_PROGRESS' | 'COMPLETED';
export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface WorkSchedule {
  id?: number;
  job?: number;
  date: string;
  start_time: string;
  end_time: string;
}

export interface Job {
  id: number;
  title: string;
  organization_name: string;
  description: string;
  location_type: string;
  job_type: JobType;
  compensation_amount: number | string;
  required_amount: number;
  status: JobStatus;
  academic_term: number;
  academic_year: number;
  poster_image_url?: string | null;
  line_group_url?: string | null;
  is_active: boolean;
  created_at: string;
  schedules?: WorkSchedule[];
}

export interface Application {
  id: number;
  student: StudentProfile;
  job: Job;
  application_date: string;
  status: ApplicationStatus;
  evaluation?: Evaluation | null;
}

export interface Evaluation {
  id: number;
  application: number | Application;
  punctuality_rating: number;
  responsibility_rating: number;
  grooming_rating: number;
  quality_rating: number;
  comment?: string;
  result_status: 'PASS' | 'FAIL';
  evaluation_date: string;
}
