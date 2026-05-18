import axiosInstance from "../api/axios";
import type { ApiResponse, CreateTaskPayload, Task } from "../types";

const toTaskFormData = (payload: CreateTaskPayload) => {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("description", payload.description ?? "");
  formData.append("deadline", payload.deadline);
  if (payload.reference_file) {
    formData.append("reference_file", payload.reference_file);
  }
  if (payload.student_ids) {
    formData.append("student_ids", JSON.stringify(payload.student_ids));
  }

  return formData;
};


export const getTasks = async (): Promise<Task[]> => {
  const response = await axiosInstance.get<ApiResponse<Task[]>>("/tasks");
  return response.data.data;
};

export const getTask = async (id: string): Promise<Task> => {
  const response = await axiosInstance.get<ApiResponse<Task>>(`/tasks/${id}`);
  return response.data.data;
};

export const createTask = async (payload: CreateTaskPayload): Promise<Task> => {
  const response = await axiosInstance.post<ApiResponse<Task>>(
    "/tasks",
    toTaskFormData(payload),
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return response.data.data;
};

export const updateTask = async ({
  id,
  payload,
}: {
  id: string;
  payload: CreateTaskPayload;
}): Promise<Task> => {
  const response = await axiosInstance.put<ApiResponse<Task>>(
    `/tasks/${id}`,
    toTaskFormData(payload),
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return response.data.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/tasks/${id}`);
};
