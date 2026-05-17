import { toggleTheme } from "../../features/theme/themeSlice";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";

export const ThemeToggle = () => {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((state) => state.theme.mode);
  const isDark = mode === "dark";

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      className={`relative h-8 w-12 rounded-full border p-1 transition duration-300 sm:h-9 sm:w-16 ${
        isDark
          ? "border-indigo-400 bg-indigo-950"
          : "border-amber-200 bg-amber-50"
      }`}
      onClick={() => dispatch(toggleTheme())}
    >
      <span
        className={`absolute top-1 flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold shadow-sm transition-all duration-300 sm:h-7 sm:w-7 sm:text-xs ${
          isDark
            ? "left-5 bg-indigo-400 text-slate-950 sm:left-8"
            : "left-1 bg-amber-400 text-slate-950"
        }`}
      >
        {isDark ? "D" : "L"}
      </span>
    </button>
  );
};
