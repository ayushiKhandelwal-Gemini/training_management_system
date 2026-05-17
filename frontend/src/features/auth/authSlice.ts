import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthResponse, User } from "../../types";
import { clearStoredAuth, getStoredAuth, saveAuth } from "../../utils/storage";

interface AuthState {
  token: string | null;
  user: User | null;
}

const persistedAuth = getStoredAuth();

const initialState: AuthState = {
  token: persistedAuth?.token ?? null,
  user: persistedAuth?.user ?? null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthResponse>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      saveAuth(action.payload);
    },
    updateCurrentUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      if (state.token) {
        saveAuth({ token: state.token, user: action.payload });
      }
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      clearStoredAuth();
    },
  },
});

export const { logout, setCredentials, updateCurrentUser } = authSlice.actions;
export default authSlice.reducer;
