import { Form, Formik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Loader } from "../../components/ui/Loader";
import { Textarea } from "../../components/ui/Textarea";
import { useCreateTask, useTask, useUpdateTask } from "../../hooks/useTaskQueries";
import { taskSchema } from "../../schemas/task.schema";

const TaskFormPage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { data: task, isLoading } = useTask(id ?? "");
  const createMutation = useCreateTask();
  const updateMutation = useUpdateTask();

  if (isEdit && isLoading) return <Loader label="Loading task" />;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">{isEdit ? "Update Task" : "Create Task"}</h1>
        <p className="text-sm text-slate-500">Create trainer work with a deadline and optional reference file.</p>
      </div>
      <Card className="p-6">
        <Formik
          enableReinitialize
          initialValues={{
            title: task?.title ?? "",
            description: task?.description ?? "",
            deadline: task?.deadline ? task.deadline.slice(0, 16) : "",
            reference_file: null as File | null,
          }}
          validationSchema={taskSchema}
          onSubmit={(values) => {
              const payload = {
                title: values.title,
                description: values.description,
                deadline: new Date(values.deadline).toISOString(),
                reference_file: values.reference_file,
              };

            if (isEdit && id) {
              updateMutation.mutate({ id, payload }, { onSuccess: () => navigate(`/trainer/tasks/${id}`) });
            } else {
              createMutation.mutate(payload, { onSuccess: (created) => navigate(`/trainer/tasks/${created.id}`) });
            }
          }}
        >
          {({ errors, touched, getFieldProps, setFieldValue, values }) => (
            <Form className="space-y-4">
              <Input label="Title" error={touched.title && errors.title} {...getFieldProps("title")} />
              <Textarea label="Description" error={touched.description && errors.description} {...getFieldProps("description")} />
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
                    setFieldValue("reference_file", event.currentTarget.files?.[0] ?? null)
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
              <div className="flex justify-end gap-3">
                <Button type="button" variant="secondary" onClick={() => navigate("/trainer/tasks")}>Cancel</Button>
                <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>
                  {isEdit ? "Update task" : "Create task"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
};

export default TaskFormPage;
