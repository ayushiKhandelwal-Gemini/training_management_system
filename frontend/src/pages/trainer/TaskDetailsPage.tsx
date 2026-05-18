import { Link, useParams } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { EmptyState } from "../../components/ui/EmptyState";
import { Loader } from "../../components/ui/Loader";
import { useTrainerAssignments } from "../../hooks/useAssignmentQueries";
import { useTrainerSubmissions } from "../../hooks/useSubmissionQueries";
import { useTask } from "../../hooks/useTaskQueries";
import { fileUrl, formatDateTime } from "../../utils/format";
import { Table } from "../../components/ui/Table";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { formatDate } from "../../utils/format";

const TaskDetailsPage = () => {
  const { id = "" } = useParams();
  const { data: task, isLoading } = useTask(id);
  const { data: assignments = [], isLoading: assignmentsLoading } =
    useTrainerAssignments();
  const { data: submissions = [], isLoading: submissionsLoading } =
    useTrainerSubmissions();
  const taskAssignments = assignments.filter(
    (assignment) => assignment.task_id === id,
  );
  const submissionByAssignment = new Map(
    submissions.map((submission) => [submission.assignment_id, submission]),
  );

  if (isLoading) return <Loader label="Loading task" />;
  if (!task) return <EmptyState title="Task not found" />;

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">{task.title}</h1>
          <p className="text-sm text-slate-500">
            Deadline: {formatDateTime(task.deadline)}
          </p>
        </div>
        <Link to={`/trainer/tasks/${task.id}/edit`}>
          <Button variant="secondary">Edit</Button>
        </Link>
      </div>
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-slate-950">Description</h2>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">
          {task.description || "No description provided."}
        </p>
      </Card>
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-slate-950">Reference File</h2>
        {task.reference_file_url ? (
          <a
            className="mt-3 inline-flex text-sm font-semibold text-sky-700 hover:text-sky-900"
            href={fileUrl(task.reference_file_url)}
            target="_blank"
            rel="noreferrer"
          >
            Open reference file
          </a>
        ) : (
          <p className="mt-3 text-sm text-slate-500">
            No reference file attached.
          </p>
        )}
      </Card>
      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">
            Assigned Students
          </h2>
          <p className="text-sm text-slate-500">
            Students assigned to this task and their current submission status.
          </p>
        </div>
        {assignmentsLoading || submissionsLoading ? (
          <Loader label="Loading assigned students" />
        ) : taskAssignments.length ? (
          <Table headers={["Student", "Email", "Status", "Assigned"]}>
            {taskAssignments.map((assignment) => {
              const submission = submissionByAssignment.get(assignment.id);

              return (
                <tr key={assignment.id}>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-950">
                    {assignment.student?.name ?? "Student unavailable"}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {assignment.student?.email ?? assignment.student_id}
                  </td>
                  <td className="px-4 py-3">
                    {submission ? (
                      <StatusBadge status={submission.status} />
                    ) : (
                      <span className="text-sm font-semibold text-amber-700">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {formatDate(assignment.assigned_at)}
                  </td>
                </tr>
              );
            })}
          </Table>
        ) : (
          <EmptyState
            title="No students assigned"
            description="Students will appear here once this task is assigned to them."
          />
        )}
      </section>
    </div>
  );
};

export default TaskDetailsPage;
