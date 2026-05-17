import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "../api/axios";
import {
  createSubmission,
  getMySubmissions,
  getTrainerSubmissions,
  reviewSubmission,
} from "../services/submission.service";
import { assignmentKeys } from "./useAssignmentQueries";

export const submissionKeys = {
  trainer: ["submissions", "trainer"] as const,
  student: ["submissions", "student"] as const,
};

export const useTrainerSubmissions = () =>
  useQuery({ queryKey: submissionKeys.trainer, queryFn: getTrainerSubmissions });

export const useMySubmissions = () =>
  useQuery({ queryKey: submissionKeys.student, queryFn: getMySubmissions });

export const useCreateSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSubmission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: submissionKeys.student });
      queryClient.invalidateQueries({ queryKey: assignmentKeys.student });
      toast.success("Submission uploaded");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
};

export const useReviewSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewSubmission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: submissionKeys.trainer });
      toast.success("Review saved");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
};
