import { useQuery } from "@tanstack/react-query";
import { getStudentById, getStudents } from "../services/student.service";

export const studentKeys = {
  all: ["students"] as const,
  detail: (id: string) => ["students", id] as const,
};

export const useStudents = () => useQuery({ queryKey: studentKeys.all, queryFn: getStudents });

export const useStudent = (id: string) =>
  useQuery({ queryKey: studentKeys.detail(id), queryFn: () => getStudentById(id), enabled: Boolean(id) });
