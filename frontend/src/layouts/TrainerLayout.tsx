import { DashboardShell } from "./DashboardShell";

const items = [
  { label: "Dashboard", to: "/trainer/dashboard" },
  { label: "Students", to: "/trainer/students" },
  { label: "Tasks", to: "/trainer/tasks" },
  { label: "Assignments", to: "/trainer/assignments" },
  { label: "Submissions", to: "/trainer/submissions" },
  { label: "Profile", to: "/trainer/profile" },
];

export const TrainerLayout = () => <DashboardShell title="TaskBridge" items={items} />;
