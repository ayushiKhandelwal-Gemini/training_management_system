import type { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: ReactNode;
}

export const Input = ({ label, error, className = "", ...props }: InputProps) => (
  <label className="block">
    {label && <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>}
    <input
      className={`h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-4 focus:ring-slate-100 ${className}`}
      {...props}
    />
    {error && <span className="mt-1 block text-sm text-red-600">{error}</span>}
  </label>
);
