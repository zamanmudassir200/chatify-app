import { useMutation, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { useChatStore } from "@/store/useChatStore";
import { useRouter } from "next/navigation";
import {
  addIntoChat,
  authenticateUser,
  createGroup,
  deleteChat,
  fetchMessages,
  getAllChatsByUser,
  loginUser,
  logoutUser,
  registerUser,
  renameChat,
  searchChats,
  searchUser,
  sendMessage,
} from "@/services/chatServices";
import {
  RegisterForm,
  AuthState,
  LoginForm,
  SearchUser,
  AddIntoChat,
  Message,
  Chat,
  RenameChat,
  GroupChat,
} from "@/components/types/types"; // Ensure types are correct

export const useHandleApiCall = () => {
  const { setUser, setSearchedData, searchedData } = useChatStore();
  const fetchChats = useChatStore((state) => state.fetchChats);

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
  const logout = useMutation<AuthState, Error, any>({
    mutationFn: logoutUser,
    onSuccess: (data) => {
      console.log("user logout");
    },
    onError: (error: unknown) => {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
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
      toast.success(data.message);
    },
    onError: (error: unknown) => {
      if (isAxiosError(error)) {
        toast.error(`${error.response?.data?.message}`);
      } else {
        toast.error("An unexpected error occured");
      }
    },
  });
  const handleSendMessage = useMutation<any, Error, Message>({
    mutationFn: sendMessage,
    onSuccess: (data) => {
      console.log("data");
    },
    onError: (error: unknown) => {
      if (isAxiosError(error)) {
        toast.error(`${error.response?.data?.message}`);
      } else {
        toast.error("An unexpected error occured");
      }
    },
  });
  const handleGetAllChatsByUser = useQuery({
    queryKey: ["chats"],
    queryFn: getAllChatsByUser,
    retry: false,
  });

  // const handleFetchMessages = useQuery({
  //   queryKey: ["messages"],
  //   queryFn: fetchMessages,
  //   retry: false,
  // });
  const handleDeleteChat = useMutation<AuthState, Error, any>({
    mutationFn: deleteChat,
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error: unknown) => {
      if (isAxiosError(error)) {
        toast.error(`${error.response?.data?.message}`);
      } else {
        toast.error("An unexpected error occured");
      }
    },
  });

  const handleSearchedChats = (searchedValue: string) =>
    useQuery<Chat[]>({
      queryKey: ["searchChats", searchedValue],
      queryFn: () => searchChats(searchedValue),
      enabled: !!searchedValue,
    });

  const handleRenameChat = useMutation<any, Error, RenameChat>({
    mutationFn: renameChat,
    onSuccess: (data, variables) => {
      const { chatId, chatName } = variables;
      // chats ko update karo
      const { chats, setChats } = useChatStore.getState();

      const updatedChats = chats.map((chat) =>
        chat._id === chatId ? { ...chat, name: chatName } : chat
      );
      setChats(updatedChats);
      toast.success(data.message);
      // setRenameChatModal(false); // modal band karo
    },
    onError: (error: unknown) => {
      if (isAxiosError(error)) {
        toast.error(`${error.response?.data?.message}`);
      } else {
        toast.error("An unexpected error occurred");
      }
    },
  });

  const handleCreateGroupChat = useMutation<any, Error, GroupChat>({
    mutationFn: createGroup,
    onSuccess: (data) => {
      console.log("create group", data);
      toast.success(data.message);
    },
    onError: (error: unknown) => {
      if (isAxiosError(error)) {
        toast.error(`${error.response?.data?.message}`);
      } else {
        toast.error("An unexpected error occurred");
      }
    },
  });
  return {
    // handleFetchMessages,
    handleCreateGroupChat,
    handleRenameChat,
    handleSearchedChats,
    handleDeleteChat,
    handleSendMessage,
    handleGetAllChatsByUser,
    register,
    login,
    searchUsers,
    authenticate,
    addUserIntoChats,
    logout,
  };
};
