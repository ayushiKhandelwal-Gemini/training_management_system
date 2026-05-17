import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { EmptyState } from "../../components/ui/EmptyState";
import { Input } from "../../components/ui/Input";
import { Loader } from "../../components/ui/Loader";
import { Modal } from "../../components/ui/Modal";
import { useAssignTask } from "../../hooks/useAssignmentQueries";
import { useTrainerAssignments } from "../../hooks/useAssignmentQueries";
import { useTrainerSubmissions } from "../../hooks/useSubmissionQueries";
import { useStudents } from "../../hooks/useStudentQueries";
import { useTask } from "../../hooks/useTaskQueries";
import { fileUrl, formatDateTime, initials } from "../../utils/format";
import { Table } from "../../components/ui/Table";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { formatDate } from "../../utils/format";

const TaskDetailsPage = () => {
  const { id = "" } = useParams();
  const { data: task, isLoading } = useTask(id);
  const { data: students = [], isLoading: studentsLoading } = useStudents();
  const { data: assignments = [], isLoading: assignmentsLoading } = useTrainerAssignments();
  const { data: submissions = [], isLoading: submissionsLoading } = useTrainerSubmissions();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const assignMutation = useAssignTask();
  const taskAssignments = assignments.filter((assignment) => assignment.task_id === id);
  const submissionByAssignment = new Map(
    submissions.map((submission) => [submission.assignment_id, submission]),
  );
  const filteredStudents = students.filter((student) =>
    `${student.name} ${student.email}`.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleStudent = (studentId: string) => {
    setSelectedStudentIds((current) =>
      current.includes(studentId)
        ? current.filter((id) => id !== studentId)
        : [...current, studentId],
    );
  };

  if (isLoading) return <Loader label="Loading task" />;
  if (!task) return <EmptyState title="Task not found" />;

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">{task.title}</h1>
          <p className="text-sm text-slate-500">Deadline: {formatDateTime(task.deadline)}</p>
        </div>
        <div className="flex gap-2">
          <Link to={`/trainer/tasks/${task.id}/edit`}><Button variant="secondary">Edit</Button></Link>
          <Button onClick={() => setOpen(true)}>Assign</Button>
        </div>
      </div>
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-slate-950">Description</h2>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">{task.description || "No description provided."}</p>
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
          <p className="mt-3 text-sm text-slate-500">No reference file attached.</p>
        )}
      </Card>
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Assigned Students</h2>
            <p className="text-sm text-slate-500">Students assigned to this task and their current submission status.</p>
          </div>
          <Button variant="secondary" onClick={() => setOpen(true)}>Assign more</Button>
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
                      <span className="text-sm font-semibold text-amber-700">Pending</span>
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
            description="Assign this task to one or more students to start tracking progress."
            action={<Button onClick={() => setOpen(true)}>Assign students</Button>}
          />
        )}
      </section>
      <Modal open={open} title="Assign task" onClose={() => setOpen(false)}>
        <div className="space-y-4">
          <Input
            label="Search students"
            placeholder="Search by name or email"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <div className="max-h-72 space-y-2 overflow-y-auto rounded-md border border-slate-200 p-2">
            {studentsLoading ? (
              <div className="py-8">
                <Loader label="Loading students" />
              </div>
            ) : filteredStudents.length ? (
              filteredStudents.map((student) => {
                const selected = selectedStudentIds.includes(student.id);

                return (
                  <button
                    key={student.id}
                    type="button"
                    className={`flex w-full items-center gap-3 rounded-md border p-3 text-left transition ${
                      selected
                        ? "border-slate-950 bg-slate-50"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                    onClick={() => toggleStudent(student.id)}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      readOnly
                      className="h-4 w-4 accent-slate-950"
                    />
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white">
                      {initials(student.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-950">{student.name}</p>
                      <p className="truncate text-xs text-slate-500">{student.email}</p>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="px-4 py-8 text-center text-sm text-slate-500">
                No students found.
              </div>
            )}
          </div>
          <p className="text-sm text-slate-500">
            {selectedStudentIds.length} student(s) selected
          </p>
          <Button
            className="w-full"
            isLoading={assignMutation.isPending || studentsLoading}
            disabled={!selectedStudentIds.length}
            onClick={() => {
              assignMutation.mutate(
                { task_id: task.id, student_ids: selectedStudentIds },
                {
                  onSuccess: () => {
                    setOpen(false);
                    setSelectedStudentIds([]);
                    setSearch("");
                  },
                },
              );
            }}
          >
            Assign task
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default TaskDetailsPage;
