import { Form, Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { useRegisterMutation } from "../hooks/useAuthMutations";
import { registerSchema } from "../schemas/auth.schema";
import type { UserRole } from "../types";

const RegisterPage = () => {
  const registerMutation = useRegisterMutation();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-md rounded-md border border-slate-200 bg-white p-6 shadow-sm">
        <p className="mb-4 text-sm font-bold text-sky-700">TaskBridge</p>
        <h1 className="text-2xl font-bold text-slate-950">Create account</h1>
        <p className="mt-2 text-sm text-slate-500">Register as a trainer or student.</p>

        <Formik
          initialValues={{ name: "", email: "", password: "", role: "STUDENT" as UserRole }}
          validationSchema={registerSchema}
          onSubmit={(values) =>
            registerMutation.mutate(values, {
              onSuccess: () => navigate("/login"),
            })
          }
        >
          {({ errors, touched, getFieldProps }) => (
            <Form className="mt-6 space-y-4">
              <Input label="Name" error={touched.name && errors.name} {...getFieldProps("name")} />
              <Input label="Email" type="email" error={touched.email && errors.email} {...getFieldProps("email")} />
              <Input
                label="Password"
                type="password"
                error={touched.password && errors.password}
                {...getFieldProps("password")}
              />
              <Select label="Role" error={touched.role && errors.role} {...getFieldProps("role")}>
                <option value="STUDENT">Student</option>
                <option value="TRAINER">Trainer</option>
              </Select>
              <Button className="w-full" type="submit" isLoading={registerMutation.isPending}>
                Register
              </Button>
            </Form>
          )}
        </Formik>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already registered? <Link className="font-semibold text-slate-950" to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
