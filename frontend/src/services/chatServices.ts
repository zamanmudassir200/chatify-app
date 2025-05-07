import axios from "axios";
import url from "@/url/url";
import {
  RegisterForm,
  LoginForm,
  SearchUser,
  AuthState,
  AddIntoChat,
  Message,
  RenameChat,
  GroupChat,
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
  const response = await axios.get(`${url}/user/searchUser`, {
    params: searchData, // send the search term as either name or email
    withCredentials: true,
  });

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
  return response.data;
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

export const sendMessage = async (data: Message): Promise<any> => {
  const response = await axios.post(
    `${url}/messages/sendMessage/${data.chat}`,

    data,

    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const fetchMessages = async (chatId: string) => {
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
