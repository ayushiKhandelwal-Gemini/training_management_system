import axiosInstance from "../api/axios";
import type { CreateSubmissionPayload, ReviewSubmissionPayload, Submission } from "../types";

export const createSubmission = async (payload: CreateSubmissionPayload): Promise<Submission> => {
  const response = await axiosInstance.post<{ data: Submission }>("/submission", payload);
  return response.data.data;
};

export const getMySubmissions = async (): Promise<Submission[]> => {
  const response = await axiosInstance.get<{ data: Submission[] }>("/submission/my");
  return response.data.data;
};

export const getTrainerSubmissions = async (): Promise<Submission[]> => {
  const response = await axiosInstance.get<{ data: Submission[] }>("/submission/trainer");
  return response.data.data;
};

export const reviewSubmission = async ({
  id,
  payload,
}: {
  id: string;
  payload: ReviewSubmissionPayload;
}): Promise<Submission> => {
  const response = await axiosInstance.put<{ data: Submission }>(`/submission/${id}/review`, payload);
  return response.data.data;
};
