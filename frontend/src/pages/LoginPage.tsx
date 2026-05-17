import { Form, Formik } from "formik";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { loginSchema } from "../schemas/auth.schema";
import { useLoginMutation } from "../hooks/useAuthMutations";
import { useAuth } from "../hooks/useAuth";

const LoginPage = () => {
  const loginMutation = useLoginMutation();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;

  if (isAuthenticated && user) {
    return <Navigate to={user.role === "TRAINER" ? "/trainer/dashboard" : "/student/dashboard"} replace />;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">TaskBridge</p>
            <h1 className="mt-8 max-w-xl text-5xl font-bold leading-tight">
              Manage trainer assignments, student submissions, and reviews from one calm workspace.
            </h1>
          </div>
          <div className="grid grid-cols-3 gap-3 text-sm text-slate-300">
            <div className="rounded-md border border-white/10 p-4">Tasks</div>
            <div className="rounded-md border border-white/10 p-4">Assignments</div>
            <div className="rounded-md border border-white/10 p-4">Reviews</div>
          </div>
        </section>
        <section className="flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-md rounded-md border border-slate-200 bg-white p-6 shadow-sm">
            <p className="mb-4 text-sm font-bold text-sky-700 lg:hidden">TaskBridge</p>
            <h2 className="text-2xl font-bold text-slate-950">Sign in</h2>
            <p className="mt-2 text-sm text-slate-500">Use your trainer or student account.</p>

            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={loginSchema}
              onSubmit={(values) =>
                loginMutation.mutate(values, {
                  onSuccess: (data) => {
                    navigate(from ?? (data.user.role === "TRAINER" ? "/trainer/dashboard" : "/student/dashboard"), {
                      replace: true,
                    });
                  },
                })
              }
            >
              {({ errors, touched, getFieldProps }) => (
                <Form className="mt-6 space-y-4">
                  <Input
                    label="Email"
                    type="email"
                    placeholder="trainer@example.com"
                    error={touched.email && errors.email}
                    {...getFieldProps("email")}
                  />
                  <Input
                    label="Password"
                    type="password"
                    placeholder="Your password"
                    error={touched.password && errors.password}
                    {...getFieldProps("password")}
                  />
                  <Button className="w-full" type="submit" isLoading={loginMutation.isPending}>
                    Login
                  </Button>
                </Form>
              )}
            </Formik>

            <p className="mt-6 text-center text-sm text-slate-500">
              Need an account? <Link className="font-semibold text-slate-950" to="/register">Register</Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
