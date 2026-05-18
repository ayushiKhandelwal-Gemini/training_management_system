import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { Modal } from "../../components/ui/Modal";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { Input } from "../../components/ui/Input";
import { Loader } from "../../components/ui/Loader";
import { Table } from "../../components/ui/Table";

import { useDeleteTask, useTasks } from "../../hooks/useTaskQueries";
import { useAssignTask } from "../../hooks/useAssignmentQueries";
import { useStudents } from "../../hooks/useStudentQueries";

import { fileUrl, formatDate, initials } from "../../utils/format";
import type { Task } from "../../types";

const TasksPage = () => {
  const [search, setSearch] = useState("");
  const [assignModalOpen, setAssignModalOpen] = useState(false);

  const [searchStudents, setSearchStudents] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const { data = [], isLoading } = useTasks();

  const { data: students = [], isLoading: studentsLoading } = useStudents();

  const deleteMutation = useDeleteTask();
  const assignTaskMutation = useAssignTask();

  const tasks = useMemo(
    () =>
      data.filter((task) =>
        task.title.toLowerCase().includes(search.toLowerCase()),
      ),
    [data, search],
  );

  const filteredStudents = students.filter((student) =>
    `${student.name} ${student.email}`
      .toLowerCase()
      .includes(searchStudents.toLowerCase()),
  );

  if (isLoading) return <Loader label="Loading tasks" />;

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Tasks</h1>

          <p className="text-sm text-slate-500">
            Create, update, assign, and track trainer tasks.
          </p>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Search tasks"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <Link to="/trainer/tasks/create">
            <Button>Create</Button>
          </Link>
        </div>
      </div>

      {tasks.length ? (
        <>
          <Table
            headers={[
              "Task",
              "Deadline",
              "Reference File",
              "Assign Students",
              "Task Controls",
            ]}
          >
            {tasks.map((task) => (
              <tr key={task.id} className="transition hover:bg-sky-50/70">
                <td className="px-4 py-3 text-sm font-semibold text-slate-950">
                  <Link
                    className="text-slate-950 hover:text-sky-700"
                    to={`/trainer/tasks/${task.id}`}
                  >
                    {task.title}
                  </Link>
                </td>

                <td className="px-4 py-3 text-sm text-slate-600">
                  {formatDate(task.deadline)}
                </td>

                <td className="px-4 py-3 text-sm text-slate-600">
                  {task.reference_file_url ? (
                    <a
                      className="font-semibold text-sky-700 hover:text-sky-900"
                      href={fileUrl(task.reference_file_url)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open file
                    </a>
                  ) : (
                    <span className="text-slate-400">No file</span>
                  )}
                </td>

                <td className="px-4 py-3">
                  <Button
                    className="h-9 w-32 px-3"
                    variant="secondary"
                    onClick={() => {
                      setSelectedTask(task);
                      setAssignModalOpen(true);

                      setSearchStudents("");

                      setSelectedStudents(task.student_ids ?? []);
                    }}
                  >
                    {(task.student_ids?.length ?? 0) > 0
                      ? "Assign More"
                      : "Assign"}
                  </Button>
                </td>

                <td className="w-52 px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link to={`/trainer/tasks/${task.id}/edit`}>
                      <Button className="h-9 w-20 px-3" variant="secondary">
                        Edit
                      </Button>
                    </Link>

                    <Button
                      className="h-9 w-20 px-3"
                      variant="danger"
                      isLoading={deleteMutation.isPending}
                      onClick={() => deleteMutation.mutate(task.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </Table>

          <Modal
            open={assignModalOpen}
            title={
              (selectedTask?.student_ids?.length ?? 0) > 0
                ? "Assign More Students"
                : "Assign Students"
            }
            onClose={() => {
              setAssignModalOpen(false);
              setSelectedTask(null);
              setSearchStudents("");
            }}
          >
            <div className="space-y-4">
              <Input
                label="Search students"
                placeholder="Search by name or email"
                value={searchStudents}
                onChange={(event) => setSearchStudents(event.target.value)}
              />

              <div className="max-h-72 space-y-2 overflow-y-auto rounded-md border border-slate-200 p-2">
                {studentsLoading ? (
                  <div className="py-8">
                    <Loader label="Loading students" />
                  </div>
                ) : filteredStudents.length ? (
                  filteredStudents.map((student) => {
                    const selected = selectedStudents.includes(student.id);

                    return (
                      <button
                        key={student.id}
                        type="button"
                        className={`flex w-full items-center gap-3 rounded-md border p-3 text-left transition ${
                          selected
                            ? "border-slate-950 bg-slate-50"
                            : "border-slate-200 bg-white hover:bg-slate-50"
                        }`}
                        onClick={() => {
                          const newIds = selectedStudents.includes(student.id)
                            ? selectedStudents.filter((id) => id !== student.id)
                            : [...selectedStudents, student.id];

                          setSelectedStudents(newIds);
                        }}
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
                          <p className="truncate text-sm font-semibold text-slate-950">
                            {student.name}
                          </p>

                          <p className="truncate text-xs text-slate-500">
                            {student.email}
                          </p>
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

              <Button
                className="w-full"
                type="button"
                isLoading={assignTaskMutation.isPending}
                disabled={!selectedTask}
                onClick={() => {
                  if (!selectedTask) return;

                  assignTaskMutation.mutate(
                    {
                      task_id: selectedTask.id,
                      student_ids: selectedStudents,
                    },
                    {
                      onSuccess: () => {
                        setAssignModalOpen(false);
                        setSelectedTask(null);
                        setSelectedStudents([]);
                        setSearchStudents("");
                      },
                    },
                  );
                }}
              >
                Save Assignments
              </Button>
            </div>
          </Modal>
        </>
      ) : (
        <EmptyState
          title="No tasks found"
          description="Create tasks and assign them to students."
        />
      )}
    </div>
  );
};

export default TasksPage;
