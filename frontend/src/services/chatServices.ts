import axios from "axios";
import url from "@/url/url";
import {
  RegisterForm,
  LoginForm,
  SearchUser,
  AuthState,
  AddIntoChat,
  RenameChat,
  GroupChat,
  AddIntoGroupChat,
  RemoveFromGroupChat,
  RenameGroupChat,
  MessagesProps,
  Messages,
  EditMessage,
} from "@/components/types/types";

export const registerUser = async (formData: RegisterForm) => {
  const response = await axios.post(`${url}/register`, formData, {
    withCredentials: true,
  });
  return response.data;
};

export const loginUser = async (formData: LoginForm) => {
  const response = await axios.post(`${url}/login`, formData, {
    withCredentials: true,
  });
  return response.data;
};
export const logoutUser = async (): Promise<any> => {
  const response = await axios.put(
    `${url}/logout`,
    {},
    {
      withCredentials: true,
    }
  );
};
// API call to search user
export const searchUser = async (
  searchData: SearchUser
): Promise<AuthState> => {
  const response = await axios.get(
    `${url}/user/searchUser?search=${searchData}`,
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export const authenticateUser = async () => {
  const response = await axios.get(`${url}/user/me`, {
    withCredentials: true,
  });
  return response.data;
};

export const getAllChatsByUser = async () => {
  const response = await axios.get(`${url}/chats/fetchChats`, {
    withCredentials: true,
  });
  return response.data.chats || [];
};

export const addIntoChat = async (userId: AddIntoChat): Promise<AuthState> => {
  const response = await axios.post(
    `${url}/chats/accessChat/${userId}`,
    {}, // If you don't have any body to send
    {
      withCredentials: true, // ✅ This now correctly tells axios to include cookies
    }
  );
  return response.data;
};
export const addIntoGroupChat = async (
  data: AddIntoGroupChat
): Promise<any> => {
  const response = await axios.put(
    `${url}/chats/addToGroup/${data.chatId}`,
    { userIds: data.userIds },
    {
      withCredentials: true,
    }
  );
  return response.data;
};
export const removeFromGroupChat = async (data: RemoveFromGroupChat) => {
  const response = await axios.put(
    `${url}/chats/removeFromGroup/${data.chatId}`,
    { userId: data.userId },
    { withCredentials: true }
  );
  return response.data;
};
export const sendMessage = async (data: MessagesProps): Promise<Messages> => {
  const response = await axios.post(
    `${url}/messages/sendMessage/${data.chatId}`,

    { content: data.content },
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const editMessage = async (data: EditMessage): Promise<any> => {
  const response = await axios.put(
    `${url}/messages/${data.messageId}`,
    { content: data.content },
    { withCredentials: true }
  );
  return response.data;
};

export const deleteMessage = async (messageId: string): Promise<any> => {
  const response = await axios.delete(`${url}/messages/${messageId}`, {
    withCredentials: true,
  });
  return response.data;
};
export const fetchAllMessagesForAChat = async (chatId: string | null) => {
  const response = await axios.get(`${url}/messages/${chatId}`, {
    withCredentials: true,
  });
  return response.data.messages;
};

export const deleteChat = async (chatId: string) => {
  const response = await axios.delete(`${url}/chats/${chatId}`, {
    withCredentials: true,
  });
  return response.data;
};

export const searchChats = async (searchedValue: string) => {
  const response = await axios.get(
    `${url}/chats/searchChats?search=${searchedValue}`,
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export const renameChat = async (data: RenameChat) => {
  const response = await axios.put(
    `${url}/chats/${data.chatId}`,
    { chatName: data.chatName },
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export const createGroup = async (data: GroupChat) => {
  const response = await axios.post(
    `${url}/chats/createGroup`,
    {
      chatName: data.chatName,
      users: data.users,
    },
    { withCredentials: true }
  );
  return response.data;
};

export const getAllUsers = async () => {
  const response = await axios.get(`${url}/user/getAllUsers`, {
    withCredentials: true,
  });
  return response.data;
};

export const renameGroup = async (data: RenameGroupChat) => {
  const response = await axios.put(
    `${url}/chats/renameGroup/${data.chatId}`,
    {
      chatName: data.chatName,
    },
    { withCredentials: true }
  );
  return response.data;
};
