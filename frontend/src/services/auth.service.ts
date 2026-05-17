import axiosInstance from "../api/axios";
import type { AuthResponse, UserRole } from "../types";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  name: string;
  role: UserRole;
}

export const loginService = async (data: LoginPayload): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>("/auth/login", data);
  return response.data;
};

export const registerService = async (data: RegisterPayload) => {
  const response = await axiosInstance.post("/auth/register", data);
  return response.data;
};
