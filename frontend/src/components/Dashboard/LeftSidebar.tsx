"use client";
import React, { Suspense, useEffect, useState, lazy } from "react";
import { Loader2 } from "lucide-react";

import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useHandleApiCall } from "@/hooks/handleApiCall";
import { useChatStore } from "@/store/useChatStore";
import Image from "next/image";
import { FaEdit } from "react-icons/fa";
const NewChat = lazy(() => import("./NewChat"));
const LogoutModal = lazy(() => import("./LogoutModal"));
import { useRouter } from "next/navigation";
import { HiDotsVertical } from "react-icons/hi";
import { searchChats } from "@/services/chatServices";
import { useQuery } from "@tanstack/react-query";
import { Chat } from "../types/types";

const LeftSidebar = () => {
  const {
    logout,
    handleGetAllChatsByUser,
    handleSearchedChats,
    handleDeleteChat,
  } = useHandleApiCall(); // Access mutation result
  const { setSelectedItem, selectedItem, setChats, chats } = useChatStore();
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  // const [search, setSearch] = useState({
  //   searchTerm: "", // Single input for both name and email
  // });
  const router = useRouter();

  const [logoutmodalOpen, setLogoutModalOpen] = useState(false);
  const handleLogout = () => {
    // Add your logout logic here
    logout.mutate({});
    router.push("/login");
    console.log("User logged out");
    setLogoutModalOpen(false);
  };

  useEffect(() => {
    if (handleGetAllChatsByUser.isSuccess) {
      setChats(handleGetAllChatsByUser?.data?.chats);
    }
  }, [handleGetAllChatsByUser.isSuccess]);
  const [optionModalChatId, setOptionModalChatId] = useState<string | null>(
    null
  );
  const deleteChatHandler = (chatId: string) => {
    handleDeleteChat.mutate(chatId);
    const updatedChats = chats.filter((chat) => chat?._id !== chatId);
    setChats(updatedChats);
  };
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [submittedTerm, setSubmittedTerm] = useState<string>("");
  const [searchData, setSearchData] = useState([]);
  // 🔍 useQuery is at top-level (not inside a function)
  const { data, isPending } = useQuery<Chat[]>({
    queryKey: ["searchChats", submittedTerm],
    queryFn: () => searchChats(submittedTerm),
    enabled: !!submittedTerm, // only run when submittedTerm is not empty
  });

  // 🔍 Just update submittedTerm on form submit
  const handleSearchField = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedTerm(searchTerm);
    // trigger query
    setSearchData(data);
    console.log("data", data);
  };
  return (
    <>
      <div className="relative flex-[0.25] px-3 py-1 bg-blue-500 text-white border-r-4">
        <div className="my-4 flex items-center justify-between">
          <Link
            className="text-xl font-bold hover:text-blue-800 duration-150 transition-all"
            href="/dashboard"
          >
            Chatify
          </Link>
          <Button
            className="bg-white text-black hover:bg-black hover:text-white duration-200 transition-all"
            onClick={() => setIsNewChatModalOpen(true)}
          >
            <FaEdit size={18} /> New Chat
          </Button>
        </div>
        <div className="relative">
          <div className="flex px-2 py-1 rounded-lg items-center border-[1px] border-gray-200">
            <form
              onSubmit={handleSearchField}
              className="flex items-center justify-between flex-1"
              // onSubmit={handleSearchSubmit}
            >
              <Input
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-none focus:border-none outline-none"
                value={searchTerm}
                type="text"
                // value={search.searchTerm}
                placeholder="Search by Name or Email"
                // onChange={handleChangeSearch}
              />
              <Button type="submit">
                <Search />
              </Button>
            </form>
          </div>
          <div className="absolute w-full h-[300px] z-50  bg-white  text-black  rounded-lg">
            {/* Optional: Display search results */}
            {/* {isPending && <p>Searching...</p>} */}
            {searchData?.length === 0 && submittedTerm && (
              <p>No chats found.</p>
            )}
            {searchData && searchData?.length > 0 && (
              <ul>
                {searchData?.map((chat: Chat) => (
                  <li
                    className="hover:bg-gray-100 py-2 px-2 border-b-[1px]"
                    key={chat._id}
                  >
                    {chat.chatName}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <hr className="my-3" />

        {chats && chats?.length > 0 ? (
          chats.map((chat: any) => {
            const isSelected = selectedItem === chat;
            const isOptionOpen = optionModalChatId === chat._id;

            return (
              <div
                onClick={() => setSelectedItem(chat)}
                key={chat._id}
                className={`relative ${
                  isSelected ? "bg-blue-800" : ""
                } flex items-center justify-between gap-2 my-3 hover:bg-blue-700 rounded-xl p-2`}
              >
                <div className="gap-2 flex items-center cursor-pointer">
                  <Image
                    src={chat.users.profilePic || "/globe.svg"}
                    width={50}
                    height={50}
                    alt="avatar"
                    loading="lazy"
                  />
                  <h1 className="text-sm">{chat.chatName}</h1>
                </div>

                <div className="relative">
                  <HiDotsVertical
                    className="cursor-pointer"
                    size={20}
                    onClick={() =>
                      setOptionModalChatId((prev) =>
                        prev === chat._id ? null : chat._id
                      )
                    }
                  />

                  {isOptionOpen && (
                    <div className="flex flex-col gap-2 absolute z-50 top-6 right-0 bg-white shadow-md rounded-md p-2">
                      <Button
                        className="cursor-pointer"
                        onClick={() => deleteChatHandler(chat._id)}
                        variant={"destructive"}
                      >
                        Delete
                      </Button>
                      <Button className="cursor-pointer">Rename</Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <h1 className="text-md font-semibold my-2 text-center">No chats</h1>
        )}

        <div className="absolute bottom-3 right-3">
          <Button
            onClick={() => setLogoutModalOpen(true)}
            variant="destructive"
          >
            Logout
          </Button>
        </div>
        {isNewChatModalOpen && (
          <Suspense
            fallback={
              <div className="inset-0 fixed flex items-center justify-center bg-white/70 z-50">
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
              </div>
            }
          >
            <NewChat setIsNewChatModalOpen={setIsNewChatModalOpen} />
          </Suspense>
        )}
      </div>

      {logoutmodalOpen && (
        <Suspense
          fallback={
            <div className="inset-0 fixed flex items-center justify-center bg-white/70 z-50">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            </div>
          }
        >
          <LogoutModal
            onConfirm={handleLogout}
            onCancel={() => setLogoutModalOpen(false)}
          />
        </Suspense>
      )}
    </>
  );
};

export default LeftSidebar;
