import axiosInstance from "../api/axios";
import type { ApiResponse, User } from "../types";

export interface UpdateProfilePayload {
  name: string;
  email: string;
}

export const getProfile = async (): Promise<User> => {
  const response = await axiosInstance.get<ApiResponse<User>>("/profile");
  return response.data.data;
};

export const updateProfile = async (
  payload: UpdateProfilePayload,
): Promise<User> => {
  const response = await axiosInstance.put<ApiResponse<User>>("/profile", payload);
  return response.data.data;
};
