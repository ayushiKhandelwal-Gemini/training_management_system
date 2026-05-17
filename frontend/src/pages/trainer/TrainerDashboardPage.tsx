import { Link } from "react-router-dom";
import { EmptyState } from "../../components/ui/EmptyState";
import { Loader } from "../../components/ui/Loader";
import { StatCard } from "../../components/ui/Card";
import { Table } from "../../components/ui/Table";
import { useTrainerDashboard } from "../../hooks/useDashboardQueries";
import { formatDate } from "../../utils/format";

const TrainerDashboardPage = () => {
  const { data, isLoading, isError } = useTrainerDashboard();

  if (isLoading) return <Loader label="Loading trainer dashboard" />;
  if (isError || !data) return <EmptyState title="Dashboard unavailable" description="Please try again in a moment." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Trainer Dashboard</h1>
        <p className="text-sm text-slate-500">Monitor tasks, assignments, and review work.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Total Tasks" value={data.totalTasks} tone="blue" />
        <StatCard title="Total Students" value={data.totalStudents} tone="slate" />
        <StatCard title="Pending Reviews" value={data.pendingReviews} tone="amber" />
        <StatCard title="Assignments" value={data.totalAssignments} tone="green" />
        <StatCard title="Reviewed" value={data.reviewedSubmissions} tone="green" />
      </div>
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-950">Recent Tasks</h2>
          <Link className="text-sm font-semibold text-slate-950" to="/trainer/tasks/create">Create task</Link>
        </div>
        {data.recentTasks.length ? (
          <Table headers={["Task", "Deadline", "Created", ""]}>
            {data.recentTasks.map((task) => (
              <tr key={task.id}>
                <td className="px-4 py-3 text-sm font-semibold text-slate-950">{task.title}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{formatDate(task.deadline)}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{formatDate(task.created_at)}</td>
                <td className="px-4 py-3 text-right text-sm">
                  <Link className="font-semibold text-slate-950" to={`/trainer/tasks/${task.id}`}>Open</Link>
                </td>
              </tr>
            ))}
          </Table>
        ) : (
          <EmptyState title="No tasks yet" description="Create your first task to start assigning work." />
        )}
      </section>
    </div>
  );
};

export default TrainerDashboardPage;
