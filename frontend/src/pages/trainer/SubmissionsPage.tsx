import { useState } from "react";
import { Form, Formik } from "formik";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { Input } from "../../components/ui/Input";
import { Loader } from "../../components/ui/Loader";
import { Modal } from "../../components/ui/Modal";
import { Select } from "../../components/ui/Select";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { Table } from "../../components/ui/Table";
import { Textarea } from "../../components/ui/Textarea";
import { useTrainerAssignments } from "../../hooks/useAssignmentQueries";
import { useReviewSubmission, useTrainerSubmissions } from "../../hooks/useSubmissionQueries";
import { reviewSchema } from "../../schemas/task.schema";
import type { Submission, TaskAssignment } from "../../types";
import { fileUrl, formatDate, formatDateTime } from "../../utils/format";

type SubmissionFilter = "ALL" | "PENDING" | "PENDING_REVIEW" | "REVIEWED";
type SubmissionRow =
  | { type: "submission"; submission: Submission; assignment?: TaskAssignment }
  | { type: "pending"; assignment: TaskAssignment };

const SubmissionsPage = () => {
  const [filter, setFilter] = useState<SubmissionFilter>("ALL");
  const [activeSubmission, setActiveSubmission] = useState<Submission | null>(null);
  const { data = [], isLoading } = useTrainerSubmissions();
  const { data: assignments = [], isLoading: assignmentsLoading } = useTrainerAssignments();
  const reviewMutation = useReviewSubmission();
  const assignmentMap = new Map(assignments.map((assignment) => [assignment.id, assignment]));
  const submittedAssignmentIds = new Set(data.map((submission) => submission.assignment_id));
  const pendingAssignments = assignments.filter(
    (assignment) => !submittedAssignmentIds.has(assignment.id),
  );
  const rows: SubmissionRow[] =
    filter === "PENDING"
      ? pendingAssignments.map((assignment) => ({ type: "pending", assignment }))
      : data
          .filter((submission) => {
            if (filter === "ALL") return true;
            if (filter === "PENDING_REVIEW") {
              return submission.status === "SUBMITTED" || submission.status === "UNDER_REVIEW";
            }
            return submission.status === filter;
          })
          .map((submission) => ({
            type: "submission",
            submission,
            assignment: assignmentMap.get(submission.assignment_id) ?? submission.assignment,
          }));

  const renderRow = (row: SubmissionRow) => {
    if (row.type === "pending") {
      const { assignment } = row;

      return (
        <tr key={assignment.id}>
          <td className="px-4 py-3 text-sm font-semibold text-slate-950">
            {assignment.task?.title ?? "Task unavailable"}
          </td>
          <td className="px-4 py-3 text-sm text-slate-600">
            {assignment.student?.name ?? "Student unavailable"}
          </td>
          <td className="px-4 py-3">
            <span className="text-sm font-semibold text-amber-700">Pending</span>
          </td>
          <td className="px-4 py-3 text-sm text-slate-600">
            {formatDate(assignment.assigned_at)}
          </td>
          <td className="px-4 py-3 text-sm text-slate-400">Not submitted</td>
          <td className="w-32 px-4 py-3">
            <div className="flex justify-end">
              <Button className="h-9 w-24" variant="secondary" disabled>
                Review
              </Button>
            </div>
          </td>
        </tr>
      );
    }

    const { submission, assignment } = row;

    return (
      <tr key={submission.id}>
        <td className="px-4 py-3 text-sm font-semibold text-slate-950">
          {assignment?.task?.title ?? "Task unavailable"}
        </td>
        <td className="px-4 py-3 text-sm text-slate-600">
          {assignment?.student?.name ?? "Student unavailable"}
        </td>
        <td className="px-4 py-3"><StatusBadge status={submission.status} /></td>
        <td className="px-4 py-3 text-sm text-slate-600">{formatDateTime(submission.submitted_at)}</td>
        <td className="px-4 py-3 text-sm">
          <a className="font-semibold text-slate-950" href={fileUrl(submission.file_url)} target="_blank" rel="noreferrer">Download</a>
        </td>
        <td className="w-32 px-4 py-3">
          <div className="flex justify-end">
            <Button
              className="h-9 w-24"
              variant={submission.status === "REVIEWED" ? "secondary" : "primary"}
              onClick={() => setActiveSubmission(submission)}
            >
              Review
            </Button>
          </div>
        </td>
      </tr>
    );
  };

  if (isLoading || assignmentsLoading) return <Loader label="Loading submissions" />;

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Submissions</h1>
          <p className="text-sm text-slate-500">Download submissions and review student work.</p>
        </div>
        <div className="w-full lg:w-72">
          <Select
            label="Filter submissions"
            value={filter}
            onChange={(event) => setFilter(event.target.value as SubmissionFilter)}
          >
            <option value="ALL">All submissions</option>
            <option value="PENDING">Pending</option>
            <option value="PENDING_REVIEW">Review left</option>
            <option value="REVIEWED">Reviewed</option>
          </Select>
        </div>
      </div>
      {rows.length ? (
        filter === "PENDING" ? (
          <Table headers={["Task", "Student", "Status", "Assigned"]}>
            {rows.map((row) => {
              if (row.type === "submission") return renderRow(row);

              const { assignment } = row;

              return (
                <tr key={assignment.id}>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-950">
                    {assignment.task?.title ?? "Task unavailable"}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {assignment.student?.name ?? "Student unavailable"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-semibold text-amber-700">Pending</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {formatDate(assignment.assigned_at)}
                  </td>
                </tr>
              );
            })}
          </Table>
        ) : (
          <Table headers={["Task", "Student", "Status", "Submitted", "File", "Review"]}>
            {rows.map(renderRow)}
          </Table>
        )
      ) : (
        <EmptyState
          title="No submissions found"
          description="Submissions matching this filter will appear here."
        />
      )}
      <Modal
        open={Boolean(activeSubmission)}
        title="Review submission"
        onClose={() => setActiveSubmission(null)}
      >
        {activeSubmission && (
          <Formik
            initialValues={{
              marks: activeSubmission.marks ?? 0,
              remarks: activeSubmission.remarks ?? "",
              status:
                "REVIEWED",
            }}
            validationSchema={reviewSchema}
            onSubmit={(values) =>
              reviewMutation.mutate(
                {
                  id: activeSubmission.id,
                  payload: {
                    marks: Number(values.marks),
                    remarks: values.remarks,
                    status: values.status as "REVIEWED" | "RESUBMIT_REQUIRED",
                  },
                },
                { onSuccess: () => setActiveSubmission(null) },
              )
            }
          >
            {({ errors, touched, getFieldProps }) => {
              const assignment =
                assignmentMap.get(activeSubmission.assignment_id) ??
                activeSubmission.assignment;

              return (
                <Form className="space-y-4">
                  <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-950">
                      {assignment?.task?.title ?? "Task unavailable"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Student: {assignment?.student?.name ?? "Student unavailable"}
                    </p>
                  </div>
                  <Input
                    label="Marks"
                    type="number"
                    error={touched.marks && errors.marks}
                    {...getFieldProps("marks")}
                  />
                  <Textarea
                    label="Remarks"
                    error={touched.remarks && errors.remarks}
                    {...getFieldProps("remarks")}
                  />
                  <Select
                    label="Decision"
                    error={touched.status && errors.status}
                    {...getFieldProps("status")}
                  >
                    <option value="REVIEWED">Reviewed</option>
                  </Select>
                  <Button
                    className="w-full"
                    type="submit"
                    isLoading={reviewMutation.isPending}
                  >
                    Save Review
                  </Button>
                </Form>
              );
            }}
          </Formik>
        )}
      </Modal>
    </div>
  );
};

export default SubmissionsPage;
