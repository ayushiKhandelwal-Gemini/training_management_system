import { Button } from "../ui/Button";
import { initials } from "../../utils/format";
import type { User } from "../../types";
import { ThemeToggle } from "../ui/ThemeToggle";

export const Navbar = ({
  user,
  onMenu,
}: {
  user?: User | null;
  onMenu: () => void;
}) => (
  <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur lg:px-6">
    <div className="flex items-center gap-3 lg:hidden">
      <Button
        variant="secondary"
        className="h-9 w-9 px-0"
        onClick={onMenu}
        aria-label="Open menu"
      >
        <span className="flex flex-col gap-1">
          <span className="block h-0.5 w-4 rounded-full bg-current" />
          <span className="block h-0.5 w-4 rounded-full bg-current" />
          <span className="block h-0.5 w-4 rounded-full bg-current" />
        </span>
      </Button>
      <p className="text-sm font-bold text-slate-950">TaskBridge</p>
    </div>
    <div className="hidden lg:block">
      <p className="text-sm font-medium text-slate-500">TaskBridge</p>
      <p className="text-xs text-slate-400">Trainer to student workflow operations</p>
    </div>
    <div className="flex items-center gap-3">
      <div className="text-right">
        <p className="text-sm font-semibold text-slate-950">{user?.name}</p>
        <p className="text-xs text-slate-500">{user?.role}</p>
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">
        {initials(user?.name)}
      </div>
      <ThemeToggle />
    </div>
  </header>
);
