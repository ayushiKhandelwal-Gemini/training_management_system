import { useMemo } from "react";
import { logout } from "../features/auth/authSlice";
import { useAppDispatch } from "./useAppDispatch";
import { useAppSelector } from "./useAppSelector";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { token, user } = useAppSelector((state) => state.auth);

  return useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      logout: () => dispatch(logout()),
    }),
    [dispatch, token, user],
  );
};
