import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { Input } from "../../components/ui/Input";
import { Loader } from "../../components/ui/Loader";
import { Modal } from "../../components/ui/Modal";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { Table } from "../../components/ui/Table";
import { useMyAssignments } from "../../hooks/useAssignmentQueries";
import { useCreateSubmission, useMySubmissions } from "../../hooks/useSubmissionQueries";
import type { TaskAssignment } from "../../types";
import { fileUrl, formatDate } from "../../utils/format";

type TaskTab = "assigned" | "pending" | "submitted";

const MyTasksPage = () => {
  const { data = [], isLoading } = useMyAssignments();
  const { data: submissions = [], isLoading: submissionsLoading } = useMySubmissions();
  const submitMutation = useCreateSubmission();
  const [active, setActive] = useState<TaskAssignment | null>(null);
  const [file, setFile] = useState("");
  const [tab, setTab] = useState<TaskTab>("assigned");
  const submissionByAssignment = new Map(
    submissions.map((submission) => [submission.assignment_id, submission]),
  );
  const assignedTasks = data;
  const pendingOnlyTasks = data.filter((assignment) => !submissionByAssignment.has(assignment.id));
  const submittedTasks = data.filter((assignment) => submissionByAssignment.has(assignment.id));
  const visibleAssignments =
    tab === "submitted" ? submittedTasks : tab === "pending" ? pendingOnlyTasks : assignedTasks;

  if (isLoading || submissionsLoading) return <Loader label="Loading assigned tasks" />;

  const tabClass = (key: TaskTab) =>
    `rounded-md px-4 py-2 text-sm font-semibold transition ${
      tab === key ? "bg-slate-950 text-white" : "bg-white text-slate-600 hover:bg-slate-100"
    }`;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">My Tasks</h1>
        <p className="text-sm text-slate-500">Track assigned, pending, and submitted work separately.</p>
      </div>
      <div className="flex flex-wrap gap-2 rounded-md border border-slate-200 bg-white p-2">
        <button className={tabClass("assigned")} onClick={() => setTab("assigned")}>
          Assigned
        </button>
        <button className={tabClass("pending")} onClick={() => setTab("pending")}>
          Pending
        </button>
        <button className={tabClass("submitted")} onClick={() => setTab("submitted")}>
          Submitted
        </button>
      </div>
      {visibleAssignments.length ? (
        <Table headers={["Task", "Trainer", "Deadline", "Status", "Reference File", "Submit"]}>
          {visibleAssignments.map((assignment) => {
            const submission = submissionByAssignment.get(assignment.id);

            return (
              <tr key={assignment.id}>
                <td className="px-4 py-3">
                  <p className="text-sm font-semibold text-slate-950">{assignment.task?.title ?? "Task"}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                    {assignment.task?.description || "No description provided."}
                  </p>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">{assignment.trainer?.name ?? "Trainer"}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{formatDate(assignment.task?.deadline)}</td>
                <td className="px-4 py-3">
                  {tab === "assigned" &&
                    (submission ? (
                      <StatusBadge status={submission.status} />
                    ) : (
                      <span className="text-sm font-semibold text-amber-700">Pending</span>
                    ))}
                  {tab === "pending" && <span className="text-sm font-semibold text-amber-700">Pending</span>}
                  {tab === "submitted" && submission && <StatusBadge status={submission.status} />}
                </td>
                <td className="px-4 py-3 text-sm">
                  {assignment.task?.reference_file_url ? (
                    <a
                      className="font-semibold text-slate-950 underline-offset-2 hover:underline"
                      href={fileUrl(assignment.task.reference_file_url)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Download
                    </a>
                  ) : (
                    <span className="text-slate-400">No file</span>
                  )}
                </td>
                <td className="w-36 px-4 py-3">
                  <div className="flex justify-end">
                  {submission ? (
                    <span className="inline-flex h-9 w-28 items-center justify-center rounded-md border border-green-200 bg-green-50 px-3 text-sm font-semibold text-green-700">
                      Submitted
                    </span>
                  ) : (
                    <Button
                      className="h-9 w-28 px-3"
                      variant="primary"
                      onClick={() => {
                        setFile("");
                        setActive(assignment);
                      }}
                    >
                      Submit Task
                    </Button>
                  )}
                  </div>
                </td>
              </tr>
            );
          })}
        </Table>
      ) : (
        <EmptyState
          title={`No ${tab} tasks`}
          description={
            tab === "submitted"
              ? "Submitted tasks will appear here after you upload work."
              : "Tasks waiting for submission will appear here."
          }
        />
      )}
      <Modal open={Boolean(active)} title="Upload submission" onClose={() => setActive(null)}>
        <div className="space-y-4">
          <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Task</p>
            <p className="mt-1 text-sm font-semibold text-slate-950">{active?.task?.title ?? "Task"}</p>
            <p className="mt-1 text-xs text-slate-500">Trainer: {active?.trainer?.name ?? "Trainer"}</p>
          </div>
          <Input
            label="Submission file URL"
            value={file}
            onChange={(event) => setFile(event.target.value)}
            placeholder="/uploads/file.pdf or https://..."
          />
          <p className="text-sm text-slate-500">
            Paste the uploaded file URL for this task. Your trainer will review it after submission.
          </p>
          <Button
            className="w-full"
            isLoading={submitMutation.isPending}
            disabled={!file.trim()}
            onClick={() =>
              active &&
              submitMutation.mutate(
                { assignment_id: active.id, file_url: file.trim() },
                {
                  onSuccess: () => {
                    setActive(null);
                    setFile("");
                  },
                },
              )
            }
          >
            Submit Work
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default MyTasksPage;
