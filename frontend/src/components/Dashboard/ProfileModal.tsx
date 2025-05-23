import React, { Suspense, lazy, useState } from "react";
import { IoClose } from "react-icons/io5";
import { Chat, User } from "../types/types";
import Image from "next/image";
import { HiUserAdd } from "react-icons/hi";
import { IoSearch } from "react-icons/io5";
import { useHandleApiCall } from "@/hooks/handleApiCall";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useChatStore } from "@/store/useChatStore";
import { BiSolidPencil } from "react-icons/bi";
import { Input } from "../ui/input";

const AddUserIntoGroupModal = lazy(() => import("./AddUserIntoGroupModal"));
interface ProfileModalProps {
  chat: Chat;
  onCancel: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ chat, onCancel }) => {
  const { handleRemoveFromGroupChat, handleRenameGroupChat } =
    useHandleApiCall();
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [chatData, setChatData] = useState<Chat>(chat);
  const [newChatName, setNewChatName] = useState(chatData.chatName);
  const { setSelectedItem } = useChatStore();
  const [openOptionsUserId, setOpenOptionsUserId] = useState<string | null>(
    null
  );

  console.log("chat profile modal", chat);
  const [isAddUserIntoGroupModalOpen, setIsAddUserIntoGroupModalOpen] =
    useState(false);

  const handleUpdateChatUsers = (newUsers: User[]) => {
    setChatData((prev) => ({
      ...prev,
      users: [...prev.users, ...newUsers], // append new users
    }));
  };

  const handleRemoveUserFromGroupChat = (userId: string) => {
    handleRemoveFromGroupChat.mutate(
      { chatId: chatData._id, userId: userId },
      {
        onSuccess: (data) => {
          const updatedChat = chatData.users.filter(
            (user) => user._id !== userId
          );
          setChatData((prev) => ({
            ...prev,
            users: updatedChat,
          }));
        },
      }
    );
  };
  const handleRenameGroup = (e: React.FormEvent) => {
    e.preventDefault();
    handleRenameGroupChat.mutate(
      { chatName: newChatName, chatId: chatData._id },
      {
        onSuccess: (data) => {
          setIsEdit(false);
          setChatData((prev) => ({ ...prev, chatName: newChatName }));
        },
      }
    );
  };
  return (
    <div className="bg-white max-w-2xl p-3 mx-2 backdrop:backdrop-brightness-50 text-black  rounded-lg shadow-md w-full ">
      <div className="flex items-center justify-between border-b pb-2">
        <h2 className="text-lg font-semibold">Chat Profile</h2>
        <IoClose
          className="cursor-pointer hover:text-red-500"
          size={24}
          onClick={onCancel}
        />
      </div>
      <div className="h-[450px] overflow-y-auto">
        <div className="flex flex-col items-center ">
          <div className="w-24 h-24 mt-2 rounded-full bg-gray-300 flex text-center select-none p-2 items-center justify-center text-xl font-bold">
            {chatData.chatName.toUpperCase()}
          </div>

          <div className="mt-3 text-center text-lg font-medium">
            <div className="flex items-center justify-center gap-4">
              {isEdit ? (
                <form onSubmit={handleRenameGroup}>
                  <Input
                    placeholder="Enter new chat name"
                    value={newChatName}
                    onChange={(e) => setNewChatName(e.target.value)}
                  />
                </form>
              ) : (
                <h1>{chatData.chatName}</h1>
              )}
              <BiSolidPencil
                onClick={() => {
                  setIsEdit(true);
                }}
                className="cursor-pointer "
                size={23}
              />
            </div>
            <div className="">
              {chatData.isGroupChat === false
                ? chatData.users[1].email
                : "Group"}
              - {chatData?.users?.length} members
            </div>
          </div>
        </div>

        <div className="mt-4 px-2">
          <hr className="my-2" />
          {chatData.isGroupChat && (
            <div className="">
              <div className="flex items-center justify-between my-2">
                <h4 className="font-semibold mb-2 ">
                  {chatData.users.length} members
                </h4>
                <IoSearch size={22} className="cursor-pointer" />
              </div>

              <ul className="overflow-visible rounded-lg border-[1px] ">
                <div
                  onClick={() => {
                    setIsAddUserIntoGroupModalOpen(true);
                    setSelectedChat(chatData);
                  }}
                  className="flex py-3 cursor-pointer hover:bg-gray-100 items-center gap-2"
                >
                  <HiUserAdd
                    className="ml-4 bg-green-500 rounded-2xl text-white p-2 "
                    size={35}
                  />
                  <h1 className="font-semibold">Add members</h1>
                </div>
                {[...chatData.users].reverse().map((user: User) => (
                  <li key={user._id} className="">
                    <div className="w-full hover:bg-gray-100 flex items-center justify-between ">
                      <div className="relative w-full border-b-[1px] flex items-center p-4 gap-2">
                        <Image
                          width={100}
                          height={100}
                          alt={user.name}
                          src={user.profilePic || ""}
                          className="rounded-full w-10 h-10 object-cover"
                        />
                        <h1>{user.name}</h1>
                        <div className="absolute flex flex-col bottom-2 items-end right-2">
                          {chatData.groupAdmin._id === user._id && (
                            <div className="">
                              <span className="  ml-2 self-end p-1 text-sm bg-green-300 border border-green-600 rounded-2xl text-center">
                                Group Admin
                              </span>
                            </div>
                          )}
                          <BsThreeDotsVertical
                            className="cursor-pointer"
                            onClick={() =>
                              setOpenOptionsUserId(
                                openOptionsUserId === user._id ? null : user._id
                              )
                            }
                          />

                          <span>{user.email}</span>
                        </div>
                        {openOptionsUserId === user._id && (
                          <div className="bg-gray-200  shadow-2xl rounded-xl absolute top-full right-0 z-[101] p-2 ">
                            <ul>
                              <li
                                onClick={() => {
                                  // setSelectedItem(chat)
                                  // onCancel()
                                }}
                                className="hover:bg-gray-400 px-2 py-1 cursor-pointer"
                              >
                                Message <b>{user.name}</b>
                              </li>
                              <li className="hover:bg-gray-400 px-2 py-1 cursor-pointer">
                                Make group admin
                              </li>
                              <li
                                onClick={() => {
                                  handleRemoveUserFromGroupChat(user._id);
                                }}
                                className="hover:bg-gray-400 px-2 py-1 cursor-pointer"
                              >
                                Remove <b>{user.name}</b>
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      {isAddUserIntoGroupModalOpen && (
        <div className="fixed inset-0 backdrop:backdrop-brightness-50 flex items-center justify-center z-[100] bg-white max-w-2xl w-full rounded-lg m-auto h-[500px] shadow-2xl">
          <Suspense fallback={<div>loading...</div>}>
            <AddUserIntoGroupModal
              chatItem={chatData}
              onCancel={() => setIsAddUserIntoGroupModalOpen(false)}
              onUpdateChat={handleUpdateChatUsers}
            />
          </Suspense>
        </div>
      )}
    </div>
  );
};

export default ProfileModal;
