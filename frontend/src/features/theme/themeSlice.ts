import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ThemeMode = "light" | "dark";

const THEME_KEY = "tms_theme";

const getInitialTheme = (): ThemeMode => {
  const storedTheme = localStorage.getItem(THEME_KEY);
  return storedTheme === "dark" ? "dark" : "light";
};

const applyTheme = (mode: ThemeMode) => {
  document.documentElement.classList.toggle("theme-dark", mode === "dark");
  localStorage.setItem(THEME_KEY, mode);
};

const initialState: { mode: ThemeMode } = {
  mode: getInitialTheme(),
};

applyTheme(initialState.mode);

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
      applyTheme(action.payload);
    },
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
      applyTheme(state.mode);
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
