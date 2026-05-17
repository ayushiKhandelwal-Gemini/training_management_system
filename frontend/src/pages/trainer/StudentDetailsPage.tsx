import { useParams } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { EmptyState } from "../../components/ui/EmptyState";
import { Loader } from "../../components/ui/Loader";
import { Table } from "../../components/ui/Table";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useTrainerAssignments } from "../../hooks/useAssignmentQueries";
import { useStudent } from "../../hooks/useStudentQueries";
import { formatDate, initials } from "../../utils/format";

const StudentDetailsPage = () => {
  const { id = "" } = useParams();
  const { data: student, isLoading } = useStudent(id);
  const { data: assignments = [] } = useTrainerAssignments();
  const studentAssignments = assignments.filter((assignment) => assignment.student_id === id);

  if (isLoading) return <Loader label="Loading student profile" />;
  if (!student) return <EmptyState title="Student not found" description="This student is not present in assignment history." />;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-950 text-lg font-bold text-white">
            {initials(student.name)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-950">{student.name}</h1>
            <p className="text-sm text-slate-500">{student.email}</p>
          </div>
        </div>
      </Card>
      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-950">Assignment History</h2>
        {studentAssignments.length ? (
          <Table headers={["Task", "Deadline", "Status", "Assigned"]}>
            {studentAssignments.map((assignment) => (
              <tr key={assignment.id}>
                <td className="px-4 py-3 text-sm font-semibold text-slate-950">{assignment.task?.title ?? "Task"}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{formatDate(assignment.task?.deadline)}</td>
                <td className="px-4 py-3"><StatusBadge status={assignment.status} /></td>
                <td className="px-4 py-3 text-sm text-slate-600">{formatDate(assignment.assigned_at)}</td>
              </tr>
            ))}
          </Table>
        ) : (
          <EmptyState title="No assignment history" />
        )}
      </section>
    </div>
  );
};

export default StudentDetailsPage;
