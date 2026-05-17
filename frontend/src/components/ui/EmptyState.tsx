import type { ReactNode } from "react";

export const EmptyState = ({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) => (
  <div className="rounded-md border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
    <h3 className="text-base font-semibold text-slate-950">{title}</h3>
    {description && <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);
