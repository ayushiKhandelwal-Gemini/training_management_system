import type { SubmissionStatus, TaskAssignmentStatus } from "../../types";

type Status = TaskAssignmentStatus | SubmissionStatus;

export const StatusBadge = ({ status }: { status: Status }) => {
  const colors: Record<Status, string> = {
    ASSIGNED: "bg-blue-50 text-blue-700 ring-blue-200",
    IN_PROGRESS: "bg-amber-50 text-amber-700 ring-amber-200",
    SUBMITTED: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    COMPLETED: "bg-green-50 text-green-700 ring-green-200",
    UNDER_REVIEW: "bg-amber-50 text-amber-700 ring-amber-200",
    REVIEWED: "bg-green-50 text-green-700 ring-green-200",
    RESUBMIT_REQUIRED: "bg-red-50 text-red-700 ring-red-200",
  };

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${colors[status]}`}>
      {status.replaceAll("_", " ")}
    </span>
  );
};
