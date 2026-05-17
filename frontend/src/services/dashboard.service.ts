import axiosInstance from "../api/axios";
import type { ApiResponse, StudentDashboardStats, TrainerDashboardStats } from "../types";

export const getTrainerDashboard = async (): Promise<TrainerDashboardStats> => {
  const response = await axiosInstance.get<ApiResponse<TrainerDashboardStats>>("/dashboard/trainer");
  return response.data.data;
};

export const getStudentDashboard = async (): Promise<StudentDashboardStats> => {
  const response = await axiosInstance.get<ApiResponse<StudentDashboardStats>>("/dashboard/student");
  return response.data.data;
};
