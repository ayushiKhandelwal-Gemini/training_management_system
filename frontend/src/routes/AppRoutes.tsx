import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProfilePage from "../pages/ProfilePage";
import { StudentLayout } from "../layouts/StudentLayout";
import { TrainerLayout } from "../layouts/TrainerLayout";
import { ProtectedRoute, RoleProtectedRoute } from "./ProtectedRoute";
import TrainerDashboardPage from "../pages/trainer/TrainerDashboardPage";
import StudentsPage from "../pages/trainer/StudentsPage";
import StudentDetailsPage from "../pages/trainer/StudentDetailsPage";
import TasksPage from "../pages/trainer/TasksPage";
import TaskFormPage from "../pages/trainer/TaskFormPage";
import TaskDetailsPage from "../pages/trainer/TaskDetailsPage";
import AssignmentsPage from "../pages/trainer/AssignmentsPage";
import SubmissionsPage from "../pages/trainer/SubmissionsPage";
import StudentDashboardPage from "../pages/student/StudentDashboardPage";
import MyTasksPage from "../pages/student/MyTasksPage";
import TrainerAssignmentsPage from "../pages/student/TrainerAssignmentsPage";

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<RoleProtectedRoute roles={["TRAINER"]} />}>
          <Route path="/trainer" element={<TrainerLayout />}>
            <Route index element={<Navigate to="/trainer/dashboard" replace />} />
            <Route path="dashboard" element={<TrainerDashboardPage />} />
            <Route path="students" element={<StudentsPage />} />
            <Route path="students/:id" element={<StudentDetailsPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="tasks/create" element={<TaskFormPage />} />
            <Route path="tasks/:id" element={<TaskDetailsPage />} />
            <Route path="tasks/:id/edit" element={<TaskFormPage />} />
            <Route path="assignments" element={<AssignmentsPage />} />
            <Route path="submissions" element={<SubmissionsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route element={<RoleProtectedRoute roles={["STUDENT"]} />}>
          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<Navigate to="/student/dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboardPage />} />
            <Route path="tasks" element={<MyTasksPage />} />
            <Route path="trainers" element={<TrainerAssignmentsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
