import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAuth } from "../hooks/useAuth";
import { Navbar } from "../components/navigation/Navbar";
import { Sidebar, type NavItem } from "../components/navigation/Sidebar";

export const DashboardShell = ({
  title,
  items,
}: {
  title: string;
  items: NavItem[];
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const listener = () => {
      dispatch(logout());
      navigate("/login", { replace: true });
    };
    window.addEventListener("auth:logout", listener);
    return () => window.removeEventListener("auth:logout", listener);
  }, [dispatch, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <Sidebar
        title={title}
        items={items}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />
      <div className="min-w-0 flex-1">
        <Navbar user={user} onMenu={() => setSidebarOpen(true)} />
        <main className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
