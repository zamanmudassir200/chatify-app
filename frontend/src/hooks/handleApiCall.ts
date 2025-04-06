import { useMutation, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { useChatStore } from "@/store/useChatStore";
import { useRouter } from "next/navigation";
import {
  addIntoChat,
  authenticateUser,
  loginUser,
  registerUser,
  searchUser,
} from "@/services/chatServices";
import {
  RegisterForm,
  AuthState,
  LoginForm,
  SearchUser,
  AddIntoChat,
} from "@/components/types/types"; // Ensure types are correct

export const useHandleApiCall = () => {
  const { setUser, setSearchedData, searchedData } = useChatStore();
  const router = useRouter();

  const register = useMutation<AuthState, Error, RegisterForm>({
    mutationFn: registerUser,
    onSuccess: (data) => {
      toast.success(data.message);
      router.push("/login");
    },
    onError: (error: unknown) => {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Registration failed.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    },
  });

  const login = useMutation<AuthState, Error, LoginForm>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setUser(data.user);
      toast.success("Logged in successfully!");
      router.push("/dashboard");
    },
    onError: (error: unknown) => {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Login failed.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    },
  });

  const searchUsers = useMutation<any, Error, SearchUser>({
    mutationFn: searchUser,
    onSuccess: (data) => {
      console.log("searched user", data);
      setSearchedData(data);
    },
    onError: (error: unknown) => {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || "User not found");
      } else {
        toast.error("An unexpected error occured");
      }
    },
  });

  const authenticate = useQuery({
    queryKey: ["user"],
    queryFn: authenticateUser,
    retry: false,
  });

  const addUserIntoChats = useMutation<AuthState, Error, AddIntoChat>({
    mutationFn: addIntoChat,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error: unknown) => {
      if (isAxiosError(error)) {
        toast.error(`${error.response?.data?.message}`);
      } else {
        toast.error("An unexpected error occured");
      }
    },
  });
  return { register, login, searchUsers, authenticate, addUserIntoChats };
};
