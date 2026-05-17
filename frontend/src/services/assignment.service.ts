import axiosInstance from "../api/axios";
import type { AssignTaskPayload, TaskAssignment } from "../types";

export const assignTask = async (payload: AssignTaskPayload) => {
  const response = await axiosInstance.post<{
    message: string;
    result: { assigned: number; skipped: number; data: TaskAssignment[] };
  }>("/task-assignments", payload);
  return response.data.result;
};

export const getTrainerAssignments = async (): Promise<TaskAssignment[]> => {
  const response = await axiosInstance.get<{ data: TaskAssignment[] }>("/task-assignments/trainer");
  return response.data.data;
};

export const getMyAssignments = async (): Promise<TaskAssignment[]> => {
  const response = await axiosInstance.get<{ data: TaskAssignment[] }>("/task-assignments/my");
  return response.data.data;
};
