import { create } from "zustand";

interface ChatState {
  user: any;
  setUser: (user: any) => void;
  searchedData: any;
  setSearchedData: (data: any) => void;
  // searchData: (searchData: SearchUser) => [];
}

export const useChatStore = create<ChatState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  searchedData: null,
  setSearchedData: (data) => set({ searchedData: data }),
}));
