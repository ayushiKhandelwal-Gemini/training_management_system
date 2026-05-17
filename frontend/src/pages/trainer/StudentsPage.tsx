import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { EmptyState } from "../../components/ui/EmptyState";
import { Input } from "../../components/ui/Input";
import { Loader } from "../../components/ui/Loader";
import { Pagination } from "../../components/ui/Pagination";
import { Table } from "../../components/ui/Table";
import { useStudents } from "../../hooks/useStudentQueries";
import { initials } from "../../utils/format";

const PAGE_SIZE = 8;

const StudentsPage = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data = [], isLoading } = useStudents();

  const filtered = useMemo(
    () =>
      data.filter((student) =>
        `${student.name} ${student.email}`.toLowerCase().includes(search.toLowerCase()),
      ),
    [data, search],
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (isLoading) return <Loader label="Loading students" />;

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Student Directory</h1>
          <p className="text-sm text-slate-500">Browse registered students and open their assignment history.</p>
        </div>
        <Input className="sm:w-72" placeholder="Search students" value={search} onChange={(event) => {
          setSearch(event.target.value);
          setPage(1);
        }} />
      </div>
      {pageItems.length ? (
        <>
          <Table headers={["Student", "Email", "Role", ""]}>
            {pageItems.map((student) => (
              <tr key={student.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white">
                      {initials(student.name)}
                    </div>
                    <span className="text-sm font-semibold text-slate-950">{student.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">{student.email}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{student.role}</td>
                <td className="px-4 py-3 text-right text-sm">
                  <Link className="font-semibold text-slate-950" to={`/trainer/students/${student.id}`}>Profile</Link>
                </td>
              </tr>
            ))}
          </Table>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      ) : (
        <EmptyState
          title="No students found"
          description="Registered student accounts will appear here."
        />
      )}
    </div>
  );
};

export default StudentsPage;
