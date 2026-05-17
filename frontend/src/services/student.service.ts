import axiosInstance from "../api/axios";
import type { ApiResponse, User } from "../types";

export const getStudents = async (): Promise<User[]> => {
  const response = await axiosInstance.get<ApiResponse<User[]>>("/students");
  return response.data.data;
};

export const getStudentById = async (id: string): Promise<User> => {
  const response = await axiosInstance.get<ApiResponse<User>>(`/students/${id}`);
  return response.data.data;
};
