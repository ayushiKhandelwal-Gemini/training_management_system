import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { Input } from "../../components/ui/Input";
import { Loader } from "../../components/ui/Loader";
import { Table } from "../../components/ui/Table";
import { useDeleteTask, useTasks } from "../../hooks/useTaskQueries";
import { fileUrl, formatDate } from "../../utils/format";

const TasksPage = () => {
  const [search, setSearch] = useState("");
  const { data = [], isLoading } = useTasks();
  const deleteMutation = useDeleteTask();
  const tasks = useMemo(
    () => data.filter((task) => task.title.toLowerCase().includes(search.toLowerCase())),
    [data, search],
  );

  if (isLoading) return <Loader label="Loading tasks" />;

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Tasks</h1>
          <p className="text-sm text-slate-500">Create, update, assign, and track trainer tasks.</p>
        </div>
        <div className="flex gap-2">
          <Input placeholder="Search tasks" value={search} onChange={(event) => setSearch(event.target.value)} />
          <Link to="/trainer/tasks/create"><Button>Create</Button></Link>
        </div>
      </div>
      {tasks.length ? (
        <Table headers={["Task", "Deadline", "Reference File", "Task Controls"]}>
          {tasks.map((task) => (
            <tr key={task.id} className="transition hover:bg-sky-50/70">
              <td className="px-4 py-3 text-sm font-semibold text-slate-950">
                <Link className="text-slate-950 hover:text-sky-700" to={`/trainer/tasks/${task.id}`}>{task.title}</Link>
              </td>
              <td className="px-4 py-3 text-sm text-slate-600">{formatDate(task.deadline)}</td>
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
              <td className="w-52 px-4 py-3">
                <div className="flex justify-end gap-2">
                  <Link to={`/trainer/tasks/${task.id}/edit`}>
                    <Button className="h-9 w-20 px-3" variant="secondary">Edit</Button>
                  </Link>
                  <Button className="h-9 w-20 px-3" variant="danger" isLoading={deleteMutation.isPending} onClick={() => deleteMutation.mutate(task.id)}>
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      ) : (
        <EmptyState title="No tasks found" description="Create tasks and assign them to students." />
      )}
    </div>
  );
};

export default TasksPage;
