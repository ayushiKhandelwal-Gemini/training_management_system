import { useMemo, useState } from "react";
import { EmptyState } from "../../components/ui/EmptyState";
import { Loader } from "../../components/ui/Loader";
import { Select } from "../../components/ui/Select";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { Table } from "../../components/ui/Table";
import { useMyAssignments } from "../../hooks/useAssignmentQueries";
import { useMySubmissions } from "../../hooks/useSubmissionQueries";
import { fileUrl, formatDate } from "../../utils/format";

const TrainerAssignmentsPage = () => {
  const { data: assignments = [], isLoading } = useMyAssignments();
  const { data: submissions = [], isLoading: submissionsLoading } = useMySubmissions();
  const [trainerId, setTrainerId] = useState("ALL");

  const submissionByAssignment = new Map(
    submissions.map((submission) => [submission.assignment_id, submission]),
  );

  const trainers = useMemo(
    () =>
      Array.from(
        new Map(
          assignments
            .filter((assignment) => assignment.trainer)
            .map((assignment) => [assignment.trainer!.id, assignment.trainer!]),
        ).values(),
      ),
    [assignments],
  );

  const filteredAssignments =
    trainerId === "ALL"
      ? assignments
      : assignments.filter((assignment) => assignment.trainer_id === trainerId);

  if (isLoading || submissionsLoading) {
    return <Loader label="Loading trainer assignments" />;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Trainer Assignments</h1>
          <p className="text-sm text-slate-500">Filter your assigned tasks by trainer.</p>
        </div>
        <div className="w-full lg:w-80">
          <Select
            label="Trainer"
            value={trainerId}
            onChange={(event) => setTrainerId(event.target.value)}
          >
            <option value="ALL">All trainers</option>
            {trainers.map((trainer) => (
              <option key={trainer.id} value={trainer.id}>
                {trainer.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {filteredAssignments.length ? (
        <Table headers={["Task", "Trainer", "Deadline", "Status", "Reference File"]}>
          {filteredAssignments.map((assignment) => {
            const submission = submissionByAssignment.get(assignment.id);

            return (
              <tr key={assignment.id}>
                <td className="px-4 py-3">
                  <p className="text-sm font-semibold text-slate-950">
                    {assignment.task?.title ?? "Task"}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                    {assignment.task?.description || "No description provided."}
                  </p>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {assignment.trainer?.name ?? "Trainer"}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {formatDate(assignment.task?.deadline)}
                </td>
                <td className="px-4 py-3">
                  {submission ? (
                    <StatusBadge status={submission.status} />
                  ) : (
                    <span className="text-sm font-semibold text-amber-700">Pending</span>
                  )}
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
              </tr>
            );
          })}
        </Table>
      ) : (
        <EmptyState title="No assignments found" description="Assignments from the selected trainer will appear here." />
      )}
    </div>
  );
};

export default TrainerAssignmentsPage;
