import { useChatStore } from "@/store/useChatStore";
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface RenameChatProps {
  chatId: string;
  onConfirm: (chatId: string, chatName: string) => void;
  onCancel: () => void;
}

const RenameChat = ({ chatId, onConfirm, onCancel }: RenameChatProps) => {
  const [chatName, setChatName] = useState("");
  const { chats, setChats } = useChatStore();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatName.trim()) {
      onConfirm(chatId, chatName.trim());
      onCancel();
    }
  };

  return (
    <main className="fixed  inset-0 flex backdrop-brightness-50 items-center justify-center min-h-screen ">
      <div className="w-full p-2 max-w-lg bg-white rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              New Chat Name
            </label>
            <IoClose
              size={24}
              className="cursor-pointer text-black hover:text-red-500"
              onClick={onCancel}
            />
          </div>
          <Input
            type="text"
            placeholder="Enter new chat name"
            value={chatName}
            onChange={(e) => setChatName(e.target.value)}
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Rename
          </Button>
        </form>
      </div>
    </main>
  );
};

export default RenameChat;
