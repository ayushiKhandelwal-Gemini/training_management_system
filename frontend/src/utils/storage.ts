import type { AuthResponse } from "../types";

const AUTH_KEY = "tms_auth";

export const saveAuth = (auth: AuthResponse) => {
  localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
};

export const getStoredAuth = (): AuthResponse | null => {
  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthResponse;
  } catch {
    localStorage.removeItem(AUTH_KEY);
    return null;
  }
};

export const clearStoredAuth = () => {
  localStorage.removeItem(AUTH_KEY);
};
