import { useQuery } from "@tanstack/react-query";
import { getStudentDashboard, getTrainerDashboard } from "../services/dashboard.service";

export const dashboardKeys = {
  trainer: ["dashboard", "trainer"] as const,
  student: ["dashboard", "student"] as const,
};

export const useTrainerDashboard = () =>
  useQuery({ queryKey: dashboardKeys.trainer, queryFn: getTrainerDashboard });

export const useStudentDashboard = () =>
  useQuery({ queryKey: dashboardKeys.student, queryFn: getStudentDashboard });
