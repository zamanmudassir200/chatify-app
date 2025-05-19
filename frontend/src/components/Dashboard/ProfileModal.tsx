import React, { Suspense,lazy, useState } from "react";
import { IoClose } from "react-icons/io5";
import { Chat, User } from "../types/types";
import Image from "next/image";
import { Button } from "../ui/button";
import { HiUserAdd } from "react-icons/hi";
import { IoSearch } from "react-icons/io5";
import { useHandleApiCall } from "@/hooks/handleApiCall";
const AddUserIntoGroupModal = lazy(()=>import('./AddUserIntoGroupModal'))
interface ProfileModalProps {
  chat: Chat;
  onCancel: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ chat, onCancel }) => {
  const { handleAddToGroupChat } = useHandleApiCall();

  // const handleAddUserIntoGroupChat  = ()=>{
  //   handleAddToGroupChat.mutate({})
  // }
  console.log("chat profile modal", chat);
  const [isAddUserIntoGroupModalOpen,setIsAddUserIntoGroupModalOpen] = useState(false)
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
          <div className="w-24 h-24 mt-2 rounded-full bg-gray-300 flex text-center p-2 items-center justify-center text-xl font-bold">
            {chat.chatName.toUpperCase()}
          </div>

          <div className="mt-3 text-center text-lg font-medium">
            <h1>{chat.chatName}</h1>
            <div className="">
              {chat.isGroupChat === false ? chat.users[1].email : "Group"} -{" "}
              {chat.users.length} members
            </div>
          </div>
        </div>

        <div className="mt-4 px-2">
          <hr className="my-2" />
          {chat.isGroupChat && (
            <div className="">
              <div className="flex items-center justify-between my-2">
                <h4 className="font-semibold mb-2 ">
                  {chat.users.length} members
                </h4>
                <IoSearch size={22} className="cursor-pointer" />
              </div>

              <ul className="overflow-hidden rounded-lg border-[1px] ">
                <div  onClick={()=>setIsAddUserIntoGroupModalOpen(true)} className="flex py-3 cursor-pointer hover:bg-gray-100 items-center gap-2">
                  <HiUserAdd
                 
                    className="ml-4 bg-green-500 rounded-2xl text-white p-2 "
                    size={35}
                  />
                  <h1 className="font-semibold">Add members</h1>
                </div>
                {[...chat.users].reverse().map((user: User) => (
                  <li key={user._id} className="">
                    <div className="w-full hover:bg-gray-100 flex items-center justify-between ">
                      <div className="relative w-full border-b-[1px] flex items-center p-4 gap-2">
                        <Image
                          width={100}
                          height={100}
                          alt={user.name}
                          src={user.profilePic}
                          className="rounded-full w-10 h-10 object-cover"
                        />
                        <h1>{user.name}</h1>
                        <div className="absolute flex flex-col bottom-2 right-2">
                          {chat.groupAdmin._id === user._id && (
                            <span className="ml-2 self-end p-1 text-sm bg-green-300 border border-green-600 rounded-2xl text-center">
                              Group Admin
                            </span>
                          )}
                          <span>{user.email}</span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      {isAddUserIntoGroupModalOpen &&
      <Suspense fallback={<div>loading...</div>}>
         <AddUserIntoGroupModal/>
      </Suspense>
      }
    </div>
  );
};

export default ProfileModal;
