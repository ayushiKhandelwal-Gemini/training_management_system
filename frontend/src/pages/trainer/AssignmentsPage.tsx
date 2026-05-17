import { useMemo, useState } from "react";
import { EmptyState } from "../../components/ui/EmptyState";
import { Loader } from "../../components/ui/Loader";
import { Modal } from "../../components/ui/Modal";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { Table } from "../../components/ui/Table";
import { useTrainerAssignments } from "../../hooks/useAssignmentQueries";
import { useTrainerSubmissions } from "../../hooks/useSubmissionQueries";
import { formatDate } from "../../utils/format";

const AssignmentsPage = () => {
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const { data = [], isLoading } = useTrainerAssignments();
  const { data: submissions = [], isLoading: submissionsLoading } = useTrainerSubmissions();
  const submissionByAssignment = new Map(
    submissions.map((submission) => [submission.assignment_id, submission]),
  );
  const activeTaskAssignments = useMemo(
    () => data.filter((assignment) => assignment.task_id === activeTaskId),
    [activeTaskId, data],
  );
  const activeTaskTitle =
    activeTaskAssignments[0]?.task?.title ?? "Assigned students";

  if (isLoading || submissionsLoading) return <Loader label="Loading assignments" />;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Assignments</h1>
        <p className="text-sm text-slate-500">Task assignment history across students.</p>
      </div>
      {data.length ? (
        <Table headers={["Task", "Student", "Status", "Assigned"]}>
          {data.map((assignment) => {
            const submission = submissionByAssignment.get(assignment.id);
            const displayStatus = submission?.status ?? assignment.status;

            return (
              <tr
                key={assignment.id}
                className="cursor-pointer transition hover:bg-slate-50"
                onClick={() => setActiveTaskId(assignment.task_id)}
              >
                <td className="px-4 py-3 text-sm font-semibold text-slate-950">{assignment.task?.title ?? assignment.task_id}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{assignment.student?.name ?? assignment.student_id}</td>
                <td className="px-4 py-3"><StatusBadge status={displayStatus} /></td>
                <td className="px-4 py-3 text-sm text-slate-600">{formatDate(assignment.assigned_at)}</td>
              </tr>
            );
          })}
        </Table>
      ) : (
        <EmptyState title="No assignments yet" description="Open a task and assign it to one or more students." />
      )}
      <Modal
        open={Boolean(activeTaskId)}
        title={activeTaskTitle}
        onClose={() => setActiveTaskId(null)}
      >
        <div className="space-y-3">
          <p className="text-sm text-slate-500">
            {activeTaskAssignments.length} student(s) assigned to this task.
          </p>
          <div className="max-h-96 overflow-y-auto rounded-md border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Student
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Assigned
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {activeTaskAssignments.map((assignment) => {
                  const submission = submissionByAssignment.get(assignment.id);
                  const displayStatus = submission?.status ?? assignment.status;

                  return (
                    <tr key={assignment.id}>
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-slate-950">
                          {assignment.student?.name ?? "Student unavailable"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {assignment.student?.email ?? assignment.student_id}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={displayStatus} />
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {formatDate(assignment.assigned_at)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AssignmentsPage;
