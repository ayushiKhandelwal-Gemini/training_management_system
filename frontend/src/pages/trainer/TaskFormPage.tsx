import { useState } from "react";
import { Form, Formik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Loader } from "../../components/ui/Loader";
import { Modal } from "../../components/ui/Modal";
import { Textarea } from "../../components/ui/Textarea";
import {
  useCreateTask,
  useTask,
  useUpdateTask,
} from "../../hooks/useTaskQueries";
import { useTrainerAssignments } from "../../hooks/useAssignmentQueries";
import { useStudents } from "../../hooks/useStudentQueries";
import { taskSchema } from "../../schemas/task.schema";
import { initials } from "../../utils/format";

const TaskFormPage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { data: task, isLoading } = useTask(id ?? "");
  const { data: students = [], isLoading: studentsLoading } = useStudents();
  const { data: assignments = [] } = useTrainerAssignments();
  const createMutation = useCreateTask();
  const updateMutation = useUpdateTask();
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [searchStudents, setSearchStudents] = useState("");

  const filteredStudents = students.filter((student) =>
    `${student.name} ${student.email}`
      .toLowerCase()
      .includes(searchStudents.toLowerCase()),
  );

  const currentStudentIds = isEdit
    ? assignments.filter((a) => a.task_id === id).map((a) => a.student_id)
    : [];

  if (isEdit && isLoading) return <Loader label="Loading task" />;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">
          {isEdit ? "Update Task" : "Create Task"}
        </h1>
        <p className="text-sm text-slate-500">
          Create trainer work with a deadline and optional reference file.
        </p>
      </div>
      <Card className="p-6">
        <Formik
          enableReinitialize
          initialValues={{
            title: task?.title ?? "",
            description: task?.description ?? "",
            deadline: task?.deadline ? task.deadline.slice(0, 16) : "",
            reference_file: null as File | null,
            student_ids: currentStudentIds,
          }}
          validationSchema={taskSchema}
          onSubmit={(values) => {
            const payload = {
              title: values.title,
              description: values.description,
              deadline: new Date(values.deadline).toISOString(),
              reference_file: values.reference_file,
              student_ids: values.student_ids,
            };

            if (isEdit && id) {
              updateMutation.mutate({ id, payload });
            } else {
              createMutation.mutate(payload, {
                onSuccess: () =>
                  navigate("/trainer/tasks/"),
              });
            }
          }}
        >
          {({ errors, touched, getFieldProps, setFieldValue, values }) => (
            <>
              <Form className="space-y-4">
                <Input
                  label="Title"
                  error={touched.title && errors.title}
                  {...getFieldProps("title")}
                />
                <Textarea
                  label="Description"
                  error={touched.description && errors.description}
                  {...getFieldProps("description")}
                />
                <Input
                  label="Deadline"
                  type="datetime-local"
                  error={touched.deadline && errors.deadline}
                  {...getFieldProps("deadline")}
                />
                <div>
                  <Input
                    label="Reference file"
                    type="file"
                    className="cursor-pointer py-2"
                    onChange={(event) =>
                      setFieldValue(
                        "reference_file",
                        event.currentTarget.files?.[0] ?? null,
                      )
                    }
                  />
                  <p className="mt-1 text-sm text-slate-500">
                    {values.reference_file
                      ? values.reference_file.name
                      : task?.reference_file_url
                        ? "Current reference file will stay unless you choose a new one."
                        : "Attach instructions, PDF, image, or other task reference material."}
                  </p>
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-semibold text-slate-950">
                      Assign Students
                    </label>
                    <span className="text-xs text-slate-500">
                      ({values.student_ids.length} selected)
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full"
                    onClick={() => setAssignModalOpen(true)}
                  >
                    {isEdit
                      ? "Update Student Assignments"
                      : "Select Students to Assign"}
                  </Button>
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => navigate("/trainer/tasks")}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    isLoading={
                      createMutation.isPending || updateMutation.isPending
                    }
                  >
                    {isEdit ? "Update task" : "Create task"}
                  </Button>
                </div>
              </Form>
              <Modal
                open={assignModalOpen}
                title={
                  isEdit ? "Update Student Assignments" : "Assign Students"
                }
                onClose={() => setAssignModalOpen(false)}
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
                        const selected = values.student_ids.includes(
                          student.id,
                        );

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
                              const newIds = values.student_ids.includes(
                                student.id,
                              )
                                ? values.student_ids.filter(
                                    (id) => id !== student.id,
                                  )
                                : [...values.student_ids, student.id];
                              setFieldValue("student_ids", newIds);
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
                    onClick={() => setAssignModalOpen(false)}
                  >
                    Done
                  </Button>
                </div>
              </Modal>
            </>
          )}
        </Formik>
      </Card>
    </div>
  );
};

export default TaskFormPage;
