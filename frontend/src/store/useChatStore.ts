import { create } from "zustand";
import { Chat, Messages } from "@/components/types/types";
import axios from "axios";
import url from "@/url/url";
// You can define proper types instead of `any` if available
interface ChatState {
  user: any; // ideally you should define a User type
  setUser: (user: any) => void;

  searchedData: any; // define SearchUser[] or similar
  setSearchedData: (data: any) => void;

  selectedItem: null | any; // instead of just []
  setSelectedItem: (data: any) => void;

  chats: any;
  setChats: (data: any) => void;

  chatName: string;
  setChatName: (data: string) => void;

  socketConnected: boolean;
  setSocketConnected: (data: boolean) => void;
  isTyping: boolean;
  setIsTyping: (data: boolean) => void;
  typing: boolean;
  setTyping: (data: boolean) => void;
  typingChat: null | any;
  setTypingChat: (data: null | string) => void;
  typingUser: null | any;
  setTypingUser: (data: any) => void;

  typingStatus: { [chatId: string]: { user?: any; isTyping: boolean } };
  setTypingStatus: (
    updater:
      | { [chatId: string]: { user?: any; isTyping: boolean } }
      | ((prev: { [chatId: string]: { user?: any; isTyping: boolean } }) => {
          [chatId: string]: { user?: any; isTyping: boolean };
        })
  ) => void;
  notification: Messages[];
  setNotification: (data: Messages[]) => void;
  onlineUsers: string[];
  setOnlineUsers: (data: string[]) => void;
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

  socketConnected: false,
  setSocketConnected: (data: boolean) => set({ socketConnected: data }),

  isTyping: false,
  setIsTyping: (data) => set({ isTyping: data }),
  typing: false,
  setTyping: (data) => set({ typing: data }),

  typingChat: null,
  setTypingChat: (id: string | null) => set({ typingChat: id }),

  typingUser: null,
  setTypingUser: (data: any) => set({ typingUser: data }),

  typingStatus: {},
  setTypingStatus: (updater) =>
    set((state) => ({
      typingStatus:
        typeof updater === "function" ? updater(state.typingStatus) : updater,
    })),
  notification: [],
  setNotification: (data: any) => set({ notification: data }),

  onlineUsers: [],
  setOnlineUsers: (data: string[]) => set({ onlineUsers: data }),
  fetchChats: async () => {
    const response = await axios.get(`${url}/chats/fetchChats`, {
      withCredentials: true,
    });
    set({ chats: response.data });
  },
}));
