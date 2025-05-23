"use client";
import React, {
  Suspense,
  useEffect,
  useState,
  lazy,
  AnyActionArg,
} from "react";
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
import { MdClose } from "react-icons/md";
import RenameChat from "./RenameChat";
// import { IoClose } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import GroupChatModal from "./GroupChatModal";

const LeftSidebar = () => {
  const {
    logout,
    handleGetAllChatsByUser,
    handleSearchedChats,
    handleRenameChat,
    handleDeleteChat,
    handleCreateGroupChat,
  } = useHandleApiCall(); // Access mutation result
  const { setSelectedItem, selectedItem, chatName, setChats, chats } =
    useChatStore();
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
  const [isGroupChatModalOpen, setIsGroupChatModalOpen] = useState(false);
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
      setChats(handleGetAllChatsByUser?.data);
    }
  }, [handleGetAllChatsByUser.isSuccess]);

  console.log("chats", chats);

  const [optionModalChatId, setOptionModalChatId] = useState<string | null>(
    null
  );
  const deleteChatHandler = (chatId: string) => {
    handleDeleteChat.mutate(chatId);
    const updatedChats = chats.filter((chat: any) => chat?._id !== chatId);
    setChats(updatedChats);
  };
  const [selectedChatId, setSelectedChatId] = useState<string>("");

  const [renameChatModal, setRenameChatModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [submittedTerm, setSubmittedTerm] = useState<string>("");
  const [searchData, setSearchData] = useState([]);
  const [searchedDataModal, setSearchedDataModal] = useState(false);
  // 🔍 useQuery is at top-level (not inside a function)
  const { data } = useQuery({
    queryKey: ["searchChats", submittedTerm],
    queryFn: () => searchChats(submittedTerm),
    enabled: !!submittedTerm, // only run when submittedTerm is not empty
  });

  // 🔍 Just update submittedTerm on form submit
  const handleSearchField = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedTerm(searchTerm);
  };
  useEffect(() => {
    if (data?.searchChats) {
      setSearchData(data.searchChats);
      setSearchedDataModal(true);
    }
  }, [data]);

  const handleRename = (chatId: string, chatName: string) => {
    handleRenameChat.mutate({ chatId, chatName });
  };

  const handleCreateGroup = (chatName: string, users: string[]) => {
    handleCreateGroupChat.mutate({ chatName, users });
  };

  return (
    <>
      <div
        className={`relative px-3 py-1 bg-blue-500 text-white border-r-4 ${
          selectedItem === null ? "flex-1 sm:flex-[0.25] md:block" : "hidden md:block"
        }  `}
      >
        <div className="relative my-4 flex items-center justify-between">
          <Link
            className="text-xl font-bold hover:text-blue-800 duration-150 transition-all"
            href="/dashboard"
          >
            Chatify
          </Link>
          <Button
            className="bg-white text-black hover:bg-black hover:text-white duration-200 transition-all"
            onClick={() => setIsOptionsModalOpen(true)}
          >
            <FaEdit size={18} /> Create Chat
          </Button>
          {isOptionsModalOpen && (
            <div className="p-2 rounded-lg w-full z-50 -bottom-35 right-0 bg-white flex flex-col gap-2 absolute">
              <div className="flex justify-between items-center">
                <h1 className="text-black font-semibold">Create Chat</h1>
                <IoMdClose
                  size={24}
                  className="text-black cursor-pointer text-end"
                  onClick={() => setIsOptionsModalOpen(false)}
                />
              </div>
              <Button
                onClick={() => {
                  setIsNewChatModalOpen(true);
                  setIsOptionsModalOpen(false);
                }}
              >
                1:1 Chat
              </Button>
              <Button
                onClick={() => {
                  setIsGroupChatModalOpen(true);
                  setIsOptionsModalOpen(false);
                }}
              >
                Create group chat
              </Button>
            </div>
          )}
        </div>
        <div className="relative">
          <div className="flex px-1 py-1 rounded-t-lg items-center border-[1px] border-gray-200">
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
              {searchTerm && searchTerm.length > 0 && (
                <MdClose
                  onClick={() => {
                    setSearchTerm("");
                    setSearchedDataModal(false);
                  }}
                  size={28}
                  className="mx-1 cursor-pointer"
                />
              )}
              <Button type="submit">
                <Search />
              </Button>
            </form>
          </div>
          {searchTerm && searchTerm.length > 0 && searchedDataModal && (
            <div className="absolute w-full h-[300px] z-50 overflow-y-auto  bg-white  text-black  rounded-b-lg">
              {searchData?.length === 0 && submittedTerm && (
                <p className="p-2 text-center text-gray-700">No chats found.</p>
              )}
              {searchData && searchData?.length > 0 && (
                <ul>
                  {searchData?.map((chat: Chat) => (
                    <li
                      onClick={() => setSelectedItem(chat)}
                      className="hover:bg-gray-100 py-2 px-2 border-b-[1px]"
                      key={chat._id}
                    >
                      <div className="gap-2 flex items-center cursor-pointer">
                        <Image
                          src={"/globe.svg"}
                          width={50}
                          height={50}
                          alt="avatar"
                          loading="lazy"
                        />
                        <h1 className="text-sm">{chat.chatName}</h1>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
        <hr className="my-3" />
        <div className="h-[calc(100vh-190px)] overflow-y-auto">
          {Array.isArray(chats) && chats.length > 0 ? (
            chats
              .slice()
              .reverse()
              .map((chat: any) => {
                const isSelected = selectedItem === chat;
                const isOptionOpen = optionModalChatId === chat._id;

                return (
                  <div
                    key={chat._id}
                    className={`relative ${
                      isSelected ? "bg-blue-800" : ""
                    } flex items-center justify-between gap-2 my-3 hover:bg-blue-700 rounded-xl p-2`}
                  >
                    <div
                      onClick={() => setSelectedItem(chat)}
                      className="gap-2 w-full flex items-center cursor-pointer"
                    >
                      <Image
                        src={"/globe.svg"}
                        width={50}
                        height={50}
                        alt="avatar"
                        loading="lazy"
                      />
                      <h1 className="text-sm">{chat.chatName}</h1>
                    </div>

                    <div className="">
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
                        <div className="flex flex-col gap-2 absolute z-50 -bottom-20 right-0 bg-white shadow-md rounded-md p-2">
                          <Button
                            className="cursor-pointer"
                            onClick={() => deleteChatHandler(chat._id)}
                            variant={"destructive"}
                          >
                            Delete
                          </Button>
                          <Button
                            onClick={() => {
                              setSelectedChatId(chat._id);
                              setRenameChatModal(true);
                            }}
                            className="cursor-pointer"
                          >
                            Rename
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
          ) : (
            <h1 className="text-md font-semibold my-2 text-center">
              Click 'New Chat' to add new chats
            </h1>
          )}
        </div>

        <div className="absolute w-full bg-blue-500 bottom-0 right-3 p-2 flex justify-end">
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
              <div className="inset-0 fixed flex items-center justify-center backdrop:brightness-50 bg-white/70 z-[100]">
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
      {renameChatModal && (
        <Suspense
          fallback={
            <div className="inset-0 fixed flex items-center justify-center bg-white/70 z-50">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            </div>
          }
        >
          <RenameChat
            chatId={selectedChatId} // set this from your state
            onConfirm={handleRename}
            onCancel={() => setRenameChatModal(false)}
          />
        </Suspense>
      )}
      {isGroupChatModalOpen && (
        <Suspense
          fallback={
            <div className="inset-0 fixed flex items-center justify-center bg-white/70 z-50">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            </div>
          }
        >
          <GroupChatModal
            onConfirm={handleCreateGroup}
            onCancel={() => setIsGroupChatModalOpen(false)}
          />
        </Suspense>
      )}
    </>
  );
};

export default LeftSidebar;
