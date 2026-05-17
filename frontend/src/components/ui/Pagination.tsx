import { Button } from "./Button";

export const Pagination = ({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) => (
  <div className="flex items-center justify-between gap-3">
    <p className="text-sm text-slate-500">
      Page {page} of {Math.max(totalPages, 1)}
    </p>
    <div className="flex gap-2">
      <Button variant="secondary" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        Previous
      </Button>
      <Button variant="secondary" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
        Next
      </Button>
    </div>
  </div>
);
