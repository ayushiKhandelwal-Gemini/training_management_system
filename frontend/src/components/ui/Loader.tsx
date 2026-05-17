export const Loader = ({ label = "Loading" }: { label?: string }) => (
  <div className="flex min-h-48 items-center justify-center">
    <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
      {label}
    </div>
  </div>
);
