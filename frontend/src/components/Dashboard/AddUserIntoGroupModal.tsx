import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { Input } from "../ui/input";
import { useHandleApiCall } from "@/hooks/handleApiCall";
import { Chat, User } from "../types/types";
import { Button } from "../ui/button";
import { TiTick } from "react-icons/ti";

interface addUserIntoGroupProps {
  chatItem: Chat;
  onCancel: () => void;
}

const AddUserIntoGroupModal = ({
  onCancel,
  chatItem,
}: addUserIntoGroupProps) => {
  const { handleFetchAllUsers } = useHandleApiCall();
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User[]>([]);

  const { data: users } = handleFetchAllUsers();

  useEffect(() => {
    if (users) {
      setAllUsers(users.users);
    }
  }, [users]);

  const handleSelectUser = (user: User) => {
    if (!selectedUser.some((u) => u._id === user._id)) {
      setSelectedUser((prev) => [...prev, user]);
    }
  };
  const handleRemoveUser = (userId: string) => {
    setSelectedUser((prev) => prev.filter((u) => u._id !== userId));
  };

  return (
    <div className="relative p-5 w-full h-full">
      <div className="flex border-b-[1px] py-1 items-center justify-between ">
        <h1 className="font-semibold text-lg">Add User into Group</h1>
        <IoClose
          className="cursor-pointer hover:text-red-500"
          onClick={onCancel}
          size={24}
        />
      </div>

      {/* Selected Users */}
      <div className="my-1">
        <form action="">
          <Input type="text" placeholder="Search User" />
        </form>
        {selectedUser.length > 0 && (
          <div className="mt-1 select-none flex items-center gap-7 overflow-x-auto">
            {selectedUser.map((user) => (
              <div
                onClick={() => handleRemoveUser(user._id)}
                key={user._id}
                className="mt-1 cursor-pointer relative flex items-center justify-center flex-col bg-green-200 p-2 rounded"
              >
                <div className="w-10 h-10 overflow-hidden rounded-full">
                  <img
                    className="w-full h-full object-cover"
                    src={user.profilePic}
                    alt={user.name}
                  />
                </div>
                <h1 className="text-center text-sm">{user.name}</h1>
                <IoClose
                  className="absolute -top-1 -right-2 border-2 rounded-full bg-gray-600 text-white hover:bg-red-600"
                  size={20}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="h-[300px] overflow-y-auto">
        {allUsers?.map((user) => {
          const isAlreadyInGroup = chatItem.users.some(
            (groupUser) => groupUser._id === user._id
          );
          const isSelected = selectedUser.some((u) => u._id === user._id);

          return (
            <div
              key={user._id}
              onClick={
                !isAlreadyInGroup ? () => handleSelectUser(user) : undefined
              }
              className={`flex justify-between items-center border p-2 rounded mb-2     ${
                isSelected ? "bg-green-600 " : ""
              }
   ${
     isAlreadyInGroup
       ? "cursor-not-allowed select-none text-gray-500"
       : "cursor-pointer "
   }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={user.profilePic}
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <h2 className="font-medium">{user.name}</h2>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              {isAlreadyInGroup && (
                <span className="text-green-600 italic text-sm font-medium">
                  Already in the group
                </span>
              )}
            </div>
          );
        })}
      </div>
      {selectedUser && selectedUser.length > 0 && (
        <Button className="absolute cursor-pointer bottom-4 right-10 bg-green-600">
          <TiTick size={100} />
        </Button>
      )}
    </div>
  );
};

export default AddUserIntoGroupModal;
