import { DashboardShell } from "./DashboardShell";

const items = [
  { label: "Dashboard", to: "/student/dashboard" },
  { label: "My Tasks", to: "/student/tasks" },
  { label: "By Trainer", to: "/student/trainers" },
  { label: "Profile", to: "/student/profile" },
];

export const StudentLayout = () => <DashboardShell title="TaskBridge" items={items} />;
