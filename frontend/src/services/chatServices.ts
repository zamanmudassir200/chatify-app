import axios from "axios";
import url from "@/url/url";
import {
  RegisterForm,
  LoginForm,
  SearchUser,
  AuthState,
  AddIntoChat,
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
  return response.data.data.chats;
};

export const addIntoChat = async (userId: AddIntoChat): Promise<AuthState> => {
  const response = await axios.post(
    `${url}/chats/addUserIntoChat/${userId}`,
    {}, // If you don't have any body to send
    {
      withCredentials: true, // ✅ This now correctly tells axios to include cookies
    }
  );
  return response.data;
};
