import { useMutation, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { useChatStore } from "@/store/useChatStore";
import { useRouter } from "next/navigation";
import {
  addIntoChat,
  addIntoGroupChat,
  authenticateUser,
  createGroup,
  deleteChat,
  deleteMessage,
  editMessage,
  fetchAllMessagesForAChat,
  getAllChatsByUser,
  getAllUsers,
  loginUser,
  logoutUser,
  registerUser,
  removeFromGroupChat,
  renameChat,
  renameGroup,
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
  AddIntoGroupChat,
  RemoveFromGroupChat,
  RenameGroupChat,
  MessagesProps,
  Messages,
  EditMessage,
} from "@/components/types/types"; // Ensure types are correct

export const useHandleApiCall = () => {
  const {
    setUser,
    chats,
    setChats,
    setChatName,
    setSearchedData,
    searchedData,
  } = useChatStore();

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

  const searchUsers = useMutation<any, Error, any>({
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
      console.log("addUser into chats", data);
      toast.success(data.message);
      setChatName(data.chat.chatName);
    },
    onError: (error: unknown) => {
      if (isAxiosError(error)) {
        toast.error(`${error.response?.data?.message}`);
      } else {
        toast.error("An unexpected error occured");
      }
    },
  });
  const handleSendMessage = useMutation<any, Error, MessagesProps>({
    mutationFn: sendMessage,
    onSuccess: (data) => {
      console.log("SEND MESSAGE", data.msg);
    },
    onError: (error: unknown) => {
      if (isAxiosError(error)) {
        toast.error(`${error.response?.data?.message}`);
      } else {
        toast.error("An unexpected error occured");
      }
    },
  });

  const handleEditMessage = useMutation<any, Error, EditMessage>({
    mutationFn: editMessage,
    onSuccess: (data) => {
      console.log("Edit message", data);
    },
    onError: (error: unknown) => {
      if (isAxiosError(error)) {
        toast.error(`${error.response?.data?.message}`);
      } else {
        toast.error("An unexpected error occured");
      }
    },
  });
  const handleDeleteMessage = useMutation<any, Error, any>({
    mutationFn: deleteMessage,
    onSuccess: (data) => {
      console.log("Delete message", data);
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

  const handleFetchMessagesForAChat = (chatId: string | null) =>
    useQuery<any>({
      queryKey: ["messages", chatId],
      queryFn: () => fetchAllMessagesForAChat(chatId),
      enabled: !!chatId, // only fetch when chatId is truthy
      retry: false,
    });

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

      const updatedChats = chats.map((chat: any) =>
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
      setChats([...chats, data.createdGroupChat]);
    },
    onError: (error: unknown) => {
      if (isAxiosError(error)) {
        toast.error(`${error.response?.data?.message}`);
      } else {
        toast.error("An unexpected error occurred");
      }
    },
  });

  const handleAddToGroupChat = useMutation<any, Error, AddIntoGroupChat>({
    mutationFn: addIntoGroupChat,
    onSuccess: (data) => {
      console.log("add into group chat", data);
      toast.success(data.message);
    },
    onError: (error: unknown) => {
      if (isAxiosError(error)) {
        toast.error(`${error.response?.data.message}`);
      } else {
        toast.error("An unexpected error occured");
      }
    },
  });

  const handleFetchAllUsers = () =>
    useQuery({
      queryKey: ["users"],
      queryFn: getAllUsers,
    });

  const handleRemoveFromGroupChat = useMutation<
    any,
    Error,
    RemoveFromGroupChat
  >({
    mutationFn: removeFromGroupChat,
    onSuccess: (data) => {
      console.log("removed from the group chat", data);
      toast.success(data.message);
    },
    onError: (error: unknown) => {
      if (isAxiosError(error)) {
        toast.error(`${error.response?.data.message}`);
      } else {
        toast.error("An unexpected error occured");
      }
    },
  });
  const handleRenameGroupChat = useMutation<any, Error, RenameGroupChat>({
    mutationFn: renameGroup,
    onSuccess: (data) => {
      console.log("RENAME GROUP CHAT", data);
      toast.success(data.message);
    },
    onError: (error: unknown) => {
      if (isAxiosError(error)) {
        toast.error(`${error.response?.data.message}`);
      } else {
        toast.error("An unexpected error occured");
      }
    },
  });
  return {
    handleFetchMessagesForAChat,
    handleDeleteMessage,
    handleEditMessage,
    handleRenameGroupChat,
    handleRemoveFromGroupChat,
    handleFetchAllUsers,
    handleAddToGroupChat,
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
