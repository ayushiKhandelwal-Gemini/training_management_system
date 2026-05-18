export type UserRole = "TRAINER" | "STUDENT";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data: T;
}

export interface PaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  deadline: string;
  trainer_id: string;
  reference_file_url?: string | null;
  student_ids?: string[];
  created_at?: string;
  updated_at?: string;
}

export type TaskAssignmentStatus =
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "COMPLETED";

export interface TaskAssignment {
  id: string;
  task_id: string;
  student_id: string;
  trainer_id: string;
  status: TaskAssignmentStatus;
  assigned_at?: string;
  task?: Task;
  student?: User;
  trainer?: User;
}

export type SubmissionStatus =
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "REVIEWED"
  | "RESUBMIT_REQUIRED";

export interface Submission {
  id: string;
  assignment_id: string;
  file_url: string;
  status: SubmissionStatus;
  submitted_at?: string;
  marks?: number | null;
  remarks?: string | null;
  reviewed_at?: string | null;
  reviewed_by?: string | null;
  created_at?: string;
  updated_at?: string;
  assignment?: TaskAssignment;
}

export interface TrainerDashboardStats {
  totalTasks: number;
  totalAssignments: number;
  totalStudents: number;
  pendingReviews: number;
  reviewedSubmissions: number;
  recentTasks: Task[];
}

export interface StudentDashboardStats {
  assignedTasks: number;
  submittedTasks: number;
  pendingTasks: number;
  reviewedTasks: number;
  recentAssignments: TaskAssignment[];
}

export interface CreateTaskPayload {
  title: string;
  description: string;
  deadline: string;
  reference_file?: File | null;
  student_ids: string[];
}

export interface AssignTaskPayload {
  task_id: string;
  student_ids: string[];
}

export interface CreateSubmissionPayload {
  assignment_id: string;
  file_url: string;
}

export interface ReviewSubmissionPayload {
  marks?: number;
  remarks?: string;
  status?: "REVIEWED" | "RESUBMIT_REQUIRED";
}
