import { Form, Formik } from "formik";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { useAuth } from "../hooks/useAuth";
import { useProfile, useUpdateProfile } from "../hooks/useProfileQueries";
import { initials } from "../utils/format";
import { Loader } from "../components/ui/Loader";

const ProfilePage = () => {
  const { user } = useAuth();
  const { data: profile, isLoading } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const currentUser = profile ?? user;

  if (isLoading) return <Loader label="Loading profile" />;
  if (!currentUser) return null;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-950 text-lg font-bold text-white">
            {initials(currentUser.name)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-950">{currentUser.name}</h1>
            <p className="text-sm text-slate-500">{currentUser.role}</p>
          </div>
        </div>
      </Card>
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-slate-950">Profile</h2>
        <Formik
          enableReinitialize
          initialValues={{ name: currentUser.name, email: currentUser.email }}
          onSubmit={(values) => {
            updateProfileMutation.mutate(values);
          }}
        >
          {({ getFieldProps }) => (
            <Form className="mt-5 space-y-4">
              <Input label="Name" {...getFieldProps("name")} />
              <Input label="Email" type="email" {...getFieldProps("email")} />
              <Button type="submit" isLoading={updateProfileMutation.isPending}>
                Update profile
              </Button>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
};

export default ProfilePage;
