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
import type { Submission } from "../../types";
import { fileUrl } from "../../utils/format";

const ReviewsPage = () => {
  const { data = [], isLoading } = useTrainerSubmissions();
  const { data: assignments = [], isLoading: assignmentsLoading } = useTrainerAssignments();
  const reviewMutation = useReviewSubmission();
  const [active, setActive] = useState<Submission | null>(null);
  const assignmentMap = new Map(assignments.map((assignment) => [assignment.id, assignment]));

  if (isLoading || assignmentsLoading) return <Loader label="Loading reviews" />;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Reviews</h1>
        <p className="text-sm text-slate-500">Add marks, remarks, and completion decisions.</p>
      </div>
      {data.length ? (
        <Table headers={["Task", "Student", "Status", "Marks", "File", ""]}>
          {data.map((submission) => {
            const assignment = assignmentMap.get(submission.assignment_id) ?? submission.assignment;
            return (
              <tr key={submission.id}>
                <td className="px-4 py-3 text-sm font-semibold text-slate-950">
                  {assignment?.task?.title ?? "Task unavailable"}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {assignment?.student?.name ?? "Student unavailable"}
                </td>
                <td className="px-4 py-3"><StatusBadge status={submission.status} /></td>
                <td className="px-4 py-3 text-sm text-slate-600">{submission.marks ?? "Not marked"}</td>
                <td className="px-4 py-3 text-sm">
                  <a className="font-semibold text-slate-950" href={fileUrl(submission.file_url)} target="_blank" rel="noreferrer">Open</a>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button variant="secondary" onClick={() => setActive(submission)}>Review</Button>
                </td>
              </tr>
            );
          })}
        </Table>
      ) : (
        <EmptyState title="No submissions to review" />
      )}
      <Modal open={Boolean(active)} title="Review submission" onClose={() => setActive(null)}>
        {active && (
          <Formik
            initialValues={{
              marks: active.marks ?? 0,
              remarks: active.remarks ?? "",
              status: active.status === "RESUBMIT_REQUIRED" ? "RESUBMIT_REQUIRED" : "REVIEWED",
            }}
            validationSchema={reviewSchema}
            onSubmit={(values) =>
              reviewMutation.mutate(
                {
                  id: active.id,
                  payload: {
                    marks: Number(values.marks),
                    remarks: values.remarks,
                    status: values.status as "REVIEWED" | "RESUBMIT_REQUIRED",
                  },
                },
                { onSuccess: () => setActive(null) },
              )
            }
          >
            {({ errors, touched, getFieldProps }) => (
              <Form className="space-y-4">
                <Input label="Marks" type="number" error={touched.marks && errors.marks} {...getFieldProps("marks")} />
                <Textarea label="Remarks" error={touched.remarks && errors.remarks} {...getFieldProps("remarks")} />
                <Select label="Decision" error={touched.status && errors.status} {...getFieldProps("status")}>
                  <option value="REVIEWED">Reviewed</option>
                  <option value="RESUBMIT_REQUIRED">Resubmit required</option>
                </Select>
                <Button className="w-full" type="submit" isLoading={reviewMutation.isPending}>Save review</Button>
              </Form>
            )}
          </Formik>
        )}
      </Modal>
    </div>
  );
};

export default ReviewsPage;
