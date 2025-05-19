import { create } from "zustand";
import { Chat } from "@/components/types/types";
import axios from "axios";
import url from "@/url/url";
// You can define proper types instead of `any` if available
interface ChatState {
  user: any; // ideally you should define a User type
  setUser: (user: any) => void;

  searchedData: any; // define SearchUser[] or similar
  setSearchedData: (data: any) => void;

  selectedItem: null | Chat; // instead of just []
  setSelectedItem: (data: Chat) => void;

  chats: any;
  setChats: (data: any) => void;

  chatName: string;
  setChatName: (data: string) => void;
  fetchChats: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),

  searchedData: null,
  setSearchedData: (data) => set({ searchedData: data }),

  selectedItem: null,
  setSelectedItem: (data) => set({ selectedItem: data }),

  chats: [],
  setChats: (data) => set({ chats: data }),

  chatName: "",
  setChatName: (data) => set({ chatName: data }),
  fetchChats: async () => {
    const response = await axios.get(`${url}/chats/fetchChats`, {
      withCredentials: true,
    });
    set({ chats: response.data });
  },
}));
