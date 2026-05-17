import { NavLink } from "react-router-dom";
import { Button } from "../ui/Button";

export interface NavItem {
  label: string;
  to: string;
}

export const Sidebar = ({
  title,
  items,
  onLogout,
  open,
  onClose,
}: {
  title: string;
  items: NavItem[];
  onLogout: () => void;
  open: boolean;
  onClose: () => void;
}) => (
  <>
    <div
      className={`fixed inset-0 z-30 bg-slate-950/40 lg:hidden ${open ? "block" : "hidden"}`}
      onClick={onClose}
    />
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform lg:static lg:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex h-16 items-center border-b border-slate-200 px-5">
        <div>
          <p className="text-lg font-bold text-slate-950">{title}</p>
          <p className="text-xs font-medium text-slate-500">Training workflow</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition ${
                isActive ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-slate-200 p-3">
        <Button variant="ghost" className="w-full justify-start" onClick={onLogout}>
          Logout
        </Button>
      </div>
    </aside>
  </>
);
