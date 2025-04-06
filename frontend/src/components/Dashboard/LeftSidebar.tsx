"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useHandleApiCall } from "@/hooks/handleApiCall";
import { SearchUser } from "../types/types";
import { useChatStore } from "@/store/useChatStore";
import Image from "next/image";
import { FaEdit } from "react-icons/fa";
import NewChat from "./NewChat";


const LeftSidebar = () => {
  const { searchUsers } = useHandleApiCall(); // Access mutation result
  const { searchedData } = useChatStore();
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(true)
  const [search, setSearch] = useState({
    searchTerm: "", // Single input for both name and email
  });

  // const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { value } = e.target;
  //   setSearch({ searchTerm: value });
  // };

  // const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   if (search.searchTerm.trim()) {
  //     const searchData: SearchUser = {
  //       email: "",
  //       name: "",
  //     };

  //     // Check if the input is an email or name
  //     if (search.searchTerm.includes("@")) {
  //       // If it looks like an email, send it as an email
  //       searchData.email = search.searchTerm;
  //     } else {
  //       // Else send it as a name
  //       searchData.name = search.searchTerm;
  //     }

  //     // Trigger the search mutation with the constructed search data
  //     searchUsers.mutate(searchData);
  //   }
  // };

  return (
    <>
      <div className="flex-[0.25] px-3 py-1 bg-blue-500 text-white border-r-4">
        <div className="my-4 flex items-center justify-between">
          <Link
            className="text-xl font-bold hover:text-blue-800 duration-150 transition-all"
            href="/dashboard"
          >
            Chatify
          </Link>
          <Button onClick={()=>setIsNewChatModalOpen(true)} className="flex items-center gap-1 text-sm cursor-pointer" ><FaEdit size={18}/> New Chat</Button>
        </div>
        <div>
          <div className="flex px-2 py-1 rounded-lg items-center border-[1px] border-gray-200">
            <form
              className="flex items-center justify-between flex-1"
              // onSubmit={handleSearchSubmit}
            >
              <Input
                className="border-none focus:border-none outline-none"
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
        </div>
        <hr className="my-3" />
        {/* Display a message when no users are found */}
        {/* {searchedData && searchedData.count === 0 && (
          <div className="text-center">No users found</div>
        )}
        <div className="">
          <ul>
            {searchedData &&
              searchedData.data.length > 0 &&
              searchedData.data.map((user: any) => {
                return (
                  <li key={user._id} onClick={()=>alert(user._id)} className="border-[1px] flex  gap-2 border-gray-300  p-5 hover:bg-blue-600 cursor-pointer transition-all duration-150  ">
                    <div className="">
                    <Image src={user.profilePic} alt="Profile" width={50} height={50} />
                    </div>
                    <div className="">
                      <h1 className="font-semibold">{user.name}</h1>
                    </div>
                  </li>
                );
              })}
          </ul>
        </div> */}
        {isNewChatModalOpen && <NewChat setIsNewChatModalOpen = {setIsNewChatModalOpen}/>}
      </div>
    </>
  );
};

export default LeftSidebar;
