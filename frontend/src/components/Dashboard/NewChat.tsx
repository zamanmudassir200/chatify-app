import React, { useState } from "react";
import { Input } from "../ui/input";
import { IoClose } from "react-icons/io5";
import { useChatStore } from "@/store/useChatStore";
import { AddIntoChat, SearchUser } from "../types/types";
import { useHandleApiCall } from "@/hooks/handleApiCall";
import { Button } from "../ui/button";
import Image from "next/image";
import { Search } from "lucide-react";

interface NewChatProps {
  setIsNewChatModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const NewChat: React.FC<NewChatProps> = ({ setIsNewChatModalOpen }) => {
  const { searchedData,chats,setChats } = useChatStore();
  const { searchUsers, addUserIntoChats } = useHandleApiCall(); // Access mutation result
  const [addingUserId, setAddingUserId] = useState<AddIntoChat | null>(null);
  const [addedUserIds, setAddedUserIds] = useState<AddIntoChat[]>([]);

  const [search, setSearch] = useState({
    searchTerm: "", // Single input for both name and email
  });

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearch({ searchTerm: value });
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (search.searchTerm.trim()) {
      const searchData: SearchUser = {
        email: "",
        name: "",
      };
      if (search.searchTerm.includes("@")) {
        searchData.email = search.searchTerm;
      } else {
        searchData.name = search.searchTerm;
      }

      searchUsers.mutate(searchData);
    }
  };
  const handleAddIntoChat = (userId: AddIntoChat) => {
    setAddingUserId(userId); // Show "Adding..." for this button

    addUserIntoChats.mutate(userId, {
      onSuccess: (data) => {
        setAddedUserIds((prev) => [...prev, userId]); // Add to added list
        setAddingUserId(null); // Reset loading state
        setTimeout(()=>{
          setIsNewChatModalOpen(false)
            },1000)
            setChats([...chats,data.chat])
      },
      onError: () => {
        setAddingUserId(null); // Reset loading state even if error occurs
      },
    });
  };

  return (
    <div className="fixed  inset-0 flex backdrop-brightness-50 items-center justify-center min-h-screen ">
      <div className="bg-white p-4  mx-2 max-w-lg w-full text-black rounded-lg ">
        <div className="flex my-3 items-center justify-between">
          <h1 className=" text-lg font-semibold">New Chat</h1>
          <div
            onClick={() => setIsNewChatModalOpen(false)}
            className=" cursor-pointer"
          >
            <IoClose size={22} />
          </div>
        </div>
        <div className="">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center justify-between gap-2"
            action=""
          >
            <Input
              onChange={handleChangeSearch}
              placeholder="Search by name or email to add"
              type="text"
            />
            <Button
              type="submit"
              className="bg-blue-500 text-white cursor-pointer"
            >
              <Search />
            </Button>
          </form>
        </div>
        {/* <hr  className="my-6" /> */}
        {searchedData && searchedData.count === 0 && (
          <div className="text-center my-4">No users found</div>
        )}
        <div className="my-4">
          <ul>
            {searchedData &&
              searchedData.data.length > 0 &&
              searchedData.data.map((user: any) => {
                return (
                  <li
                    key={user._id}
                    onClick={()=>handleAddIntoChat(user._id)}
                    className=" border-[1px] flex justify-between gap-2 border-gray-300  p-5 hover:bg-gray-200 cursor-pointer transition-all duration-150  "
                  >
                    <div className="flex gap-3">
                      <div className="">
                        <Image
                          src={user.profilePic}
                          alt="Profile"
                          width={50}
                          height={50}
                        />
                      </div>
                      <div className="">
                        <h1 className="font-semibold">{user.name}</h1>
                      </div>
                    </div>
                    {/* <div className="">
                      <Button
                        onClick={() => handleAddIntoChat(user._id)}
                        className="bg-green-500 select-none text-white cursor-pointer"
                        disabled={
                          addedUserIds.includes(user._id) ||
                          addingUserId === user._id
                        }
                      >
                        {addedUserIds.includes(user._id)
                          ? "Added"
                          : addingUserId === user._id
                          ? "Adding..."
                          : "Add"}
                      </Button>
                    </div> */}
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NewChat;
