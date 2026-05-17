import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "../api/axios";
import { assignTask, getMyAssignments, getTrainerAssignments } from "../services/assignment.service";

export const assignmentKeys = {
  trainer: ["assignments", "trainer"] as const,
  student: ["assignments", "student"] as const,
};

export const useTrainerAssignments = () =>
  useQuery({ queryKey: assignmentKeys.trainer, queryFn: getTrainerAssignments });

export const useMyAssignments = () =>
  useQuery({ queryKey: assignmentKeys.student, queryFn: getMyAssignments });

export const useAssignTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignTask,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: assignmentKeys.trainer });
      toast.success(`Assigned ${result.assigned} student(s)`);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
};
