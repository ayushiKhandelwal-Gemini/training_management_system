import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "../api/axios";
import { setCredentials } from "../features/auth/authSlice";
import { loginService, registerService } from "../services/auth.service";
import { useAppDispatch } from "./useAppDispatch";

export const useLoginMutation = () => {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: loginService,
    onSuccess: (data) => {
      dispatch(setCredentials(data));
      toast.success("Welcome back");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
};

export const useRegisterMutation = () =>
  useMutation({
    mutationFn: registerService,
    onSuccess: () => toast.success("Account created. You can log in now."),
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
