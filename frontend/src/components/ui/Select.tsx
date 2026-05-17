import type { ReactNode, SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: ReactNode;
}

export const Select = ({ label, error, className = "", children, ...props }: SelectProps) => (
  <label className="block">
    {label && <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>}
    <select
      className={`h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-slate-100 ${className}`}
      {...props}
    >
      {children}
    </select>
    {error && <span className="mt-1 block text-sm text-red-600">{error}</span>}
  </label>
);
