import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "../api/axios";
import { createTask, deleteTask, getTask, getTasks, updateTask } from "../services/task.service";

export const taskKeys = {
  all: ["tasks"] as const,
  detail: (id: string) => ["tasks", id] as const,
};

export const useTasks = () => useQuery({ queryKey: taskKeys.all, queryFn: getTasks });

export const useTask = (id: string) =>
  useQuery({ queryKey: taskKeys.detail(id), queryFn: () => getTask(id), enabled: Boolean(id) });

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      toast.success("Task created");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTask,
    onSuccess: (task) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(task.id) });
      toast.success("Task updated");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      toast.success("Task deleted");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
};
