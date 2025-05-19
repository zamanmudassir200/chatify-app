import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useChatStore } from "@/store/useChatStore";
import { useHandleApiCall } from "@/hooks/handleApiCall";
import { SearchUser, User } from "../types/types";

interface GroupChatModalProps {
  onConfirm: (chatName: string, users: string[]) => void;
  onCancel: () => void;
}

const GroupChatModal = ({ onConfirm, onCancel }: GroupChatModalProps) => {
  const [chatName, setChatName] = useState("");
  const [searchedUser, setSearchedUser] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const { searchedData } = useChatStore();
  const { searchUsers } = useHandleApiCall();

  // Debounced search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchedUser.trim().length >= 2) {
        searchUsers.mutate(searchedUser.trim());
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchedUser]);

  // Select user from search result
  const handleUserSelect = (user: User) => {
    if (!selectedUsers.find((u) => u._id === user._id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  // Submit group chat form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatName || selectedUsers.length === 0) {
      alert("Please enter chat name and at least one user.");
      return;
    }
    const userIds = selectedUsers.map((user) => user._id);
    onConfirm(chatName, userIds);
  };

  return (
    <main className="fixed px-3 inset-0 flex items-center justify-center backdrop-brightness-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md relative">
        {/* Close Button */}
        <IoClose
          size={24}
          className="absolute top-3 right-3 cursor-pointer hover:text-red-500"
          onClick={onCancel}
        />

        {/* Heading */}
        <h2 className="text-xl font-semibold mb-4">Create Group Chat</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Group Chat Name */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Group Chat Name
            </label>
            <Input
              type="text"
              placeholder="Enter group chat name"
              value={chatName}
              onChange={(e) => setChatName(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Add Users */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Add Users
            </label>
            <Input
              type="text"
              placeholder="Search user by name or email"
              value={searchedUser}
              onChange={(e) => setSearchedUser(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Searched Result List */}
            {searchedData?.data?.length > 0 && (
              <ul className="bg-white border mt-1 rounded-md shadow p-2 max-h-40 overflow-y-auto">
                {searchedData?.data?.map((user: User) => (
                  <li
                    key={user._id}
                    onClick={() => handleUserSelect(user)}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {user.name} ({user.email})
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Selected Users JSON Display */}
          {/* <div className="flex flex-col gap-2 max-h-40 overflow-y-auto bg-gray-50 p-2 rounded">
            <h4 className="font-semibold text-sm">Selected Users (JSON):</h4>
            <pre className="text-xs text-gray-700 bg-white p-2 rounded border">
              {JSON.stringify(selectedUsers, null, 2)}
            </pre>
          </div> */}
          {/* Selected Users List with Remove (X) Button */}
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                {user.name}
                <button
                  type="button"
                  onClick={() =>
                    setSelectedUsers((prev) =>
                      prev.filter((u) => u._id !== user._id)
                    )
                  }
                  className="text-blue-500 hover:text-red-500"
                >
                  <IoClose size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Create Group
          </Button>
        </form>
      </div>
    </main>
  );
};

export default GroupChatModal;
