import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "../api/axios";
import { updateCurrentUser } from "../features/auth/authSlice";
import { getProfile, updateProfile } from "../services/profile.service";
import { useAppDispatch } from "./useAppDispatch";

export const profileKeys = {
  current: ["profile", "current"] as const,
};

export const useProfile = () =>
  useQuery({
    queryKey: profileKeys.current,
    queryFn: getProfile,
  });

export const useUpdateProfile = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (user) => {
      dispatch(updateCurrentUser(user));
      queryClient.setQueryData(profileKeys.current, user);
      toast.success("Profile updated");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
};
