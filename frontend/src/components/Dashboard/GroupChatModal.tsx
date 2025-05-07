import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface GroupChatModalProps {
  onConfirm: (chatName: string, users: string[]) => void;
  onCancel: () => void;
}

const GroupChatModal = ({ onConfirm, onCancel }: GroupChatModalProps) => {
  const [chatName, setChatName] = useState("");
  const [userInput, setUserInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const users = userInput
      .split(",")
      .map((user) => user.trim())
      .filter((user) => user !== "");

    if (!chatName || users.length === 0) {
      alert("Please enter chat name and at least one user.");
      return;
    }

    onConfirm(chatName, users);
  };

  return (
    <main className="fixed inset-0 flex items-center justify-center backdrop-brightness-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm relative">
        <IoClose
          size={24}
          className="absolute top-3 right-3 cursor-pointer hover:text-red-500"
          onClick={onCancel}
        />

        <h2 className="text-xl font-semibold mb-4">Create Group Chat</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

          <div>
            <label className="text-sm font-medium text-gray-700">
              Add Users
            </label>
            <Input
              type="text"
              placeholder="e.g. user1@example.com, user2@example.com"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

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
