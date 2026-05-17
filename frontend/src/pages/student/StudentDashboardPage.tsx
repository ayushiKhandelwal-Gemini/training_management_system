import { Link } from "react-router-dom";
import { EmptyState } from "../../components/ui/EmptyState";
import { Loader } from "../../components/ui/Loader";
import { StatCard } from "../../components/ui/Card";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { Table } from "../../components/ui/Table";
import { useStudentDashboard } from "../../hooks/useDashboardQueries";
import { formatDate } from "../../utils/format";

const StudentDashboardPage = () => {
  const { data, isLoading, isError } = useStudentDashboard();

  if (isLoading) return <Loader label="Loading student dashboard" />;
  if (isError || !data) return <EmptyState title="Dashboard unavailable" description="Please try again in a moment." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Student Dashboard</h1>
        <p className="text-sm text-slate-500">Track assigned tasks, submissions, and trainer feedback.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Assigned Tasks" value={data.assignedTasks} tone="blue" />
        <StatCard title="Completed Tasks" value={data.submittedTasks} tone="green" />
        <StatCard title="Pending Tasks" value={data.pendingTasks} tone="amber" />
        <StatCard title="Reviewed" value={data.reviewedTasks} tone="green" />
      </div>
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-950">Recent Assignments</h2>
          <Link className="text-sm font-semibold text-slate-950" to="/student/tasks">View all</Link>
        </div>
        {data.recentAssignments.length ? (
          <Table headers={["Task", "Trainer", "Deadline", "Status", "Assigned"]}>
            {data.recentAssignments.map((assignment) => (
              <tr key={assignment.id}>
                <td className="px-4 py-3 text-sm font-semibold text-slate-950">{assignment.task?.title ?? "Task"}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{assignment.trainer?.name ?? "Trainer"}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{formatDate(assignment.task?.deadline)}</td>
                <td className="px-4 py-3"><StatusBadge status={assignment.status} /></td>
                <td className="px-4 py-3 text-sm text-slate-600">{formatDate(assignment.assigned_at)}</td>
              </tr>
            ))}
          </Table>
        ) : (
          <EmptyState title="No assignments yet" description="Assigned tasks will appear here." />
        )}
      </section>
    </div>
  );
};

export default StudentDashboardPage;
