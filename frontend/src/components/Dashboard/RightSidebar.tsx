// "use client";

// import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
// import { Input } from "../ui/input";

// import { IoIosSend } from "react-icons/io";
// import { useHandleApiCall } from "@/hooks/handleApiCall";
// import { useChatStore } from "@/store/useChatStore";
// import { Messages } from "../types/types";
// import { generateChatRoomId } from "@/utils/chatRoom"; // Add this import at top
// import { IoClose } from "react-icons/io5";
// import Image from "next/image";

// const ProfileModal = lazy(() => import("./ProfileModal"));

// const RightSidebar = () => {
//   const { authenticate, handleSendMessage, handleFetchMessages } =
//     useHandleApiCall();
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState<Messages[]>([]);

//   const { selectedItem, setSelectedItem } = useChatStore();
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   console.log("selectedItem", selectedItem);
//   useEffect(() => {
//     if (authenticate.isSuccess) {
//       console.log("Authenticated user data: ", authenticate.data);
//     }
//   }, [authenticate.isSuccess]);

//   const selectedChatId = selectedItem?._id;

//   const { data, isPending, isSuccess } = handleFetchMessages(
//     selectedChatId ?? ""
//   );

//   const currentUserId = authenticate?.data?.data?._id;
//   const targetUserId = selectedItem?.users?.find(
//     (user: any) => user._id !== currentUserId
//   )?._id;

//   const chatRoomId =
//     currentUserId && targetUserId
//       ? generateChatRoomId(currentUserId, targetUserId)
//       : null;

//   const [showContextMenu, setShowContextMenu] = useState(false);
//   const [contextMenuPosition, setContextMenuPosition] = useState({
//     x: 0,
//     y: 0,
//   });

//   useEffect(() => {
//     const handleClickOutside = () => setShowContextMenu(false);
//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, []);
//   const handleExitChat = () => {
//     setSelectedItem(null); // this triggers your placeholder UI
//     setShowContextMenu(false);
//   };

//   useEffect(() => {
//     console.log("data", data);
//   }, []);

//   const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
//   const handleSendMessageSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!message.trim()) return;

//     handleSendMessage.mutate(
//       {
//         content: message,
//         chatId: selectedChatId ?? "",
//         sender: currentUserId,
//         // chatRoomId: chatRoomId,
//       },
//       {
//         onSuccess: (sentMessage) => {
//           console.log("sentMessage:", sentMessage);
//           setMessage("");
//           setMessages((prev) => [...prev, sentMessage.msg]);
//           setTimeout(() => {
//             messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//           }, 100);
//         },
//       }
//     );
//   };
//   useEffect(() => {
//     if (isSuccess && data) {
//       setMessages(data); // Assuming API response structure
//     }
//   }, [isSuccess, data]);

//   if (selectedItem === null) {
//     return (
//       <div
//         className={`bg-slate-300 min-h-screen flex flex-col items-center justify-center ${
//           selectedItem ? "block flex-1" : "hidden"
//         }`}
//       >
//         {/* Header style match */}
//         <div className="w-full text-white flex items-center justify-between px-5 py-3 h-16 bg-blue-500"></div>

//         {/* Main placeholder content */}
//         <div className="flex-1 w-full flex flex-col items-center justify-center">
//           <h2 className="text-2xl text-gray-700 font-semibold">
//             Select a chat to start messaging
//           </h2>
//           <p className="text-gray-500 mt-2 text-sm">
//             Your conversations will appear here
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       {selectedItem === null ? (
//         <div
//           className={`bg-slate-300 min-h-screen flex flex-col items-center justify-center ${
//             selectedItem ? "block flex-1" : "hidden"
//           }`}
//         >
//           {/* Header style match */}
//           <div className="w-full text-white flex items-center justify-between px-5 py-3 h-16 bg-blue-500"></div>

//           {/* Main placeholder content */}
//           <div className="flex-1 w-full flex flex-col items-center justify-center">
//             <h2 className="text-2xl text-gray-700 font-semibold">
//               Select a chat to start messaging
//             </h2>
//             <p className="text-gray-500 mt-2 text-sm">
//               Your conversations will appear here
//             </p>
//           </div>
//         </div>
//       ) : (
//         <div
//           className="flex-1"
//           onContextMenu={(e) => {
//             e.preventDefault();
//             setContextMenuPosition({ x: e.clientX, y: e.clientY });
//             setShowContextMenu(true);
//           }}
//         >
//           <div className="relative w-full text-white flex items-center justify-between px-5 py-3 h-16 bg-blue-500">
//             <div
//               onClick={() => setIsProfileModalOpen(true)}
//               className="flex cursor-pointer items-center gap-2"
//             >
//               <Image
//                 width={100}
//                 height={100}
//                 alt={selectedItem.chatName}
//                 src={"./next.svg"}
//                 className="h-10 w-10 rounded-2xl"
//               />
//               <h1>{selectedItem?.chatName}</h1>
//             </div>

//             <div className="">icons</div>
//             <div className="">
//               <IoClose
//                 className="cursor-pointer"
//                 onClick={() => {
//                   setSelectedItem(null);
//                 }}
//                 size={24}
//               />
//             </div>

//             {isProfileModalOpen && selectedItem && (
//               <div className="fixed inset-0 flex items-center justify-center backdrop:brightness-50 z-50">
//                 <Suspense fallback={<div>loading...</div>}>
//                   <ProfileModal
//                     chat={selectedItem}
//                     onCancel={() => setIsProfileModalOpen(false)}
//                   />
//                 </Suspense>
//               </div>
//             )}
//           </div>

//           <div className="flex flex-col bg-slate-300 min-h-[calc(100vh-64px)] ">
//             <div className="p-5 overflow-y-auto h-[calc(100vh-134px)] space-y-2">
//               {Array.isArray(messages) &&
//                 messages.map((msg, index) => {
//                   const isSender = msg?.sender?._id === currentUserId;

//                   return (
//                     <div
//                       key={index}
//                       className={`max-w-[70%] px-2 py-4 rounded-lg text-sm ${
//                         isSender
//                           ? "ml-auto bg-green-500 text-white"
//                           : "mr-auto bg-white text-black"
//                       }`}
//                     >
//                       <div className="relative flex items-center gap-2">
//                         <div className="h-10 w-10 rounded-2xl overflow-hidden">
//                           <img
//                             className="w-full h-full object-cover"
//                             src={msg.sender.profilePic}
//                             alt=""
//                           />
//                         </div>
//                         <span className="font-semibold"> {msg?.content}</span>
//                         <p className="absolute text-xs -bottom-2 -right-1">
//                           {new Date(msg?.createdAt).toLocaleString()}
//                         </p>
//                         {selectedItem.isGroupChat && (
//                           <span className="absolute text-xs -top-4 left-0 font-semibold ">
//                             {msg.sender.name}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   );
//                 })}

//               <div ref={messagesEndRef} />
//             </div>

//             <div className="bg-blue-500 h-[70px] w-full grid place-items-center">
//               <form
//                 onSubmit={(e) => {
//                   handleSendMessageSubmit(e);
//                 }}
//                 className="flex items-center w-full px-4 py-3 justify-evenly gap-2"
//               >
//                 <div className="flex-1 w-full text-white">
//                   <Input
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     className="text-lg font-semibold placeholder:text-gray-300 "
//                     placeholder="Message"
//                   />
//                 </div>
//                 <div>
//                   <button type="submit" disabled={handleSendMessage.isPending}>
//                     {handleSendMessage.isPending ? (
//                       <div className="text-white">...</div>
//                     ) : (
//                       <IoIosSend
//                         className="text-white cursor-pointer"
//                         size={37}
//                       />
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//           <div className=""></div>
//         </div>
//       )}
//       {showContextMenu && (
//         <div
//           className="absolute z-50 bg-white shadow-lg rounded-md p-2 border text-sm"
//           style={{ top: contextMenuPosition.y, left: contextMenuPosition.x }}
//           onClick={handleExitChat}
//           onMouseLeave={() => setShowContextMenu(false)}
//         >
//           <p className="cursor-pointer hover:bg-red-100 px-2 py-1 text-red-600">
//             Exit Chat
//           </p>
//         </div>
//       )}
//     </>
//   );
// };

// export default RightSidebar;
"use client";

import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { IoIosSend } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import Image from "next/image";

import { useHandleApiCall } from "@/hooks/handleApiCall";
import { useChatStore } from "@/store/useChatStore";
import { Messages } from "../types/types";
import { generateChatRoomId } from "@/utils/chatRoom";
import { BsThreeDots } from "react-icons/bs";
import { MdCopyAll, MdDeleteOutline, MdEdit } from "react-icons/md";

const ProfileModal = lazy(() => import("./ProfileModal"));

const RightSidebar = () => {
  const {
    authenticate,
    handleSendMessage,
    handleFetchMessages,
    handleEditMessage,
    handleDeleteMessage,
  } = useHandleApiCall();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Messages[]>([]);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const [newMessage, setNewMessage] = useState(message);

  const { selectedItem, setSelectedItem } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedChatId = selectedItem?._id;
  const { data, isSuccess } = handleFetchMessages(selectedChatId ?? "");

  const currentUserId = authenticate?.data?.data?._id;
  const targetUserId = selectedItem?.users?.find(
    (user: any) => user._id !== currentUserId
  )?._id;
  const chatRoomId =
    currentUserId && targetUserId
      ? generateChatRoomId(currentUserId, targetUserId)
      : null;

  useEffect(() => {
    if (authenticate.isSuccess) {
      console.log("Authenticated user data: ", authenticate.data);
    }
  }, [authenticate.isSuccess]);

  useEffect(() => {
    if (isSuccess && data) {
      setMessages(data);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    const handleClickOutside = () => setShowContextMenu(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleExitChat = () => {
    setSelectedItem(null);
    setShowContextMenu(false);
  };

  const handleSendMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    handleSendMessage.mutate(
      {
        content: message,
        chatId: selectedChatId ?? "",
        sender: currentUserId,
      },
      {
        onSuccess: (sentMessage) => {
          setMessage("");
          setMessages((prev) => [...prev, sentMessage.msg]);
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        },
      }
    );
  };
  const [options, setOptions] = useState<boolean>(false);
  const [optionId, setOptionId] = useState<string | null>(null);
  const [optionDotId, setOptionDotId] = useState<string | null>(null);
  const [isEditMessage, setIsEditMessage] = useState<boolean>(false);
  const [editMessageId, setEditMessageId] = useState<string | null>(null);

  const handleSubmitEditMessage = (e: React.FormEvent, msgId: string) => {
    e.preventDefault();
    handleEditMessage.mutate(
      { messageId: msgId, content: newMessage },
      {
        onSuccess: (data) => {
          setIsEditMessage(false);
          console.log("data", data);
          console.log("messages", messages);
          setMessages((prev) =>
            prev.map((msg) => {
              return msg._id === msgId ? { ...msg, content: newMessage } : msg;
            })
          );
        },
      }
    );
  };
  const handleDelete = (msgId: string) => {
    handleDeleteMessage.mutate({ messageId: msgId });
  };
  if (selectedItem === null) {
    return (
      <div
        className={` bg-slate-300 min-h-screen flex flex-col items-center justify-center ${
          selectedItem === null ? "hidden sm:block flex-1" : "block "
        }`}
      >
        <div className="w-full text-white flex items-center justify-center  px-5 py-3 h-16 bg-blue-500">
          <h1 className="text-2xl ">
            Welcome back <strong>{authenticate?.data?.data?.name} 👋</strong>
          </h1>
        </div>
        <div className="flex-1 h-[calc(100vh-64px)] w-full flex flex-col items-center justify-center">
          <h2 className="text-2xl text-gray-700 font-semibold">
            Select a chat to start messaging
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            Your conversations will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`flex-1 w-full sm:w-[calc(100%-300px)] ${
          selectedItem === null ? "hidden sm:block flex-1" : "block "
        }`}
        onContextMenu={(e) => {
          e.preventDefault();
          setContextMenuPosition({ x: e.clientX, y: e.clientY });
          setShowContextMenu(true);
        }}
      >
        <div className="relative w-full text-white flex items-center justify-between px-5 py-3 h-16 bg-blue-500 z-[100]">
          <div
            onClick={() => setIsProfileModalOpen(true)}
            className="flex cursor-pointer items-center gap-2"
          >
            <Image
              width={100}
              height={100}
              alt={selectedItem.chatName}
              src={"./next.svg"}
              className="h-10 w-10 rounded-2xl"
            />
            <h1>{selectedItem?.chatName}</h1>
          </div>

          <div className="">icons</div>
          <IoClose
            className="cursor-pointer"
            onClick={() => setSelectedItem(null)}
            size={24}
          />

          {isProfileModalOpen && selectedItem && (
            <div className="fixed inset-0 flex items-center justify-center backdrop:brightness-50 z-50">
              <Suspense fallback={<div>loading...</div>}>
                <ProfileModal
                  chat={selectedItem}
                  onCancel={() => setIsProfileModalOpen(false)}
                />
              </Suspense>
            </div>
          )}
        </div>

        <div className="flex flex-col bg-slate-300 min-h-[calc(100vh-64px)]">
          <div className="p-5 overflow-y-auto h-[calc(100vh-134px)] space-y-2">
            {Array.isArray(messages) &&
              messages.map((msg) => {
                const isSender = msg?.sender?._id === currentUserId;
                const isOptionDot = optionDotId === msg._id;
                const isOptionSee = optionId === msg._id;
                const isEditing = editMessageId === msg._id;
                return (
                  <div
                    onMouseEnter={() => {
                      setOptionDotId(msg._id);
                      setOptions(false);
                    }}
                    onMouseLeave={() => {
                      setOptionDotId(null);
                      setOptions(false);
                    }}
                    key={msg._id}
                    className="flex  items-center justify-center gap-2"
                  >
                    {selectedItem.isGroupChat && !isSender && (
                      <div className="h-10 w-10 rounded-2xl overflow-hidden">
                        <img
                          className="w-full h-full object-cover"
                          src={msg.sender.profilePic}
                          alt=""
                        />
                      </div>
                    )}
                    <div
                      className={` relative max-w-[45%] w-full px-2 py-5 rounded-lg text-sm ${
                        isSender
                          ? "ml-auto bg-green-500 "
                          : "mr-auto bg-white text-black"
                      }`}
                    >
                      <div className="relative flex items-center gap-2">
                        <span className="py-1 font-semibold">
                          {isEditMessage && isEditing ? (
                            <div className="flex items-center gap-2 ">
                              <form
                                onSubmit={(e) =>
                                  handleSubmitEditMessage(e, msg._id)
                                }
                              >
                                <Input
                                  placeholder="Enter new message"
                                  value={newMessage}
                                  onChange={(e) =>
                                    setNewMessage(e.target.value)
                                  }
                                />
                              </form>
                              <h1
                                onClick={() => setIsEditMessage(false)}
                                className="cursor-pointer  rounded bg-gray-200 hover:bg-red-400 flex items-center justify-center h-5 w-5 "
                              >
                                X
                              </h1>
                            </div>
                          ) : (
                            msg?.content
                          )}
                        </span>
                        <p className="absolute text-xs -bottom-4  opacity-80 right-0">
                          {new Date(msg?.createdAt).toLocaleString()}
                        </p>
                        {selectedItem.isGroupChat && !isSender && (
                          <span className="absolute text-xs -top-4 left-0 text-gray-800 font-semibold">
                            {msg.sender.name}
                          </span>
                        )}
                      </div>
                      <div
                        className={`absolute top-5 ${
                          isSender ? " -left-10" : "-right-10  "
                        }`}
                      >
                        {isOptionDot && (
                          <div className="">
                            <BsThreeDots
                              onClick={() => {
                                setOptions(true);
                                setOptionId(msg._id);
                              }}
                              size={26}
                              className="bg-gray-200 rounded-2xl p-1 cursor-pointer "
                            />
                          </div>
                        )}
                        <div
                          className={`z-[153] absolute    ${
                            isSender ? "left-7 top-10" : "-right-50 top-5"
                          }`}
                        >
                          {isOptionSee && options && (
                            <div className="bg-white rounded-xl w-[200px] p-2">
                              <ul className="flex flex-col gap-2">
                                <li
                                  className={`hover:underline  hover:text-blue-700 cursor-pointer ${
                                    isSender ? "" : "py-0"
                                  }  `}
                                >
                                  {isSender && (
                                    <span
                                      onClick={() => {
                                        setIsEditMessage(true);
                                        setEditMessageId(msg._id);
                                        setNewMessage(msg.content)
                                      }}
                                      className="flex items-center gap-1"
                                    >
                                      <MdEdit className="text-xl" /> Edit
                                    </span>
                                  )}
                                </li>
                                <li
                                  onClick={() => handleDelete(msg._id)}
                                  className=" hover:underline  hover:text-red-500 cursor-pointer flex gap-[1px] items-center "
                                >
                                  <MdDeleteOutline className="text-xl" />
                                  Delete
                                  {/* delete for everyone and delete for me */}
                                </li>
                                <li className="hover:underline  hover:text-blue-700 cursor-pointer flex gap-[2px]` items-center ">
                                  <MdCopyAll className="text-lg" /> Copy
                                </li>
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            <div ref={messagesEndRef} />
          </div>

          <div className="bg-blue-500 h-[70px] w-full grid place-items-center">
            <form
              onSubmit={handleSendMessageSubmit}
              className="flex items-center w-full px-4 py-3 justify-evenly gap-2"
            >
              <div className="flex-1 w-full text-white">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="text-lg font-semibold placeholder:text-gray-300"
                  placeholder="Message"
                />
              </div>
              <div>
                <button type="submit" disabled={handleSendMessage.isPending}>
                  {handleSendMessage.isPending ? (
                    <div className="text-white">...</div>
                  ) : (
                    <IoIosSend
                      className="text-white cursor-pointer"
                      size={37}
                    />
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {showContextMenu && (
        <div
          className="absolute z-50 bg-white shadow-lg rounded-md p-2 border text-sm"
          style={{ top: contextMenuPosition.y, left: contextMenuPosition.x }}
          onClick={handleExitChat}
          onMouseLeave={() => setShowContextMenu(false)}
        >
          <p className="cursor-pointer hover:bg-red-100 px-2 py-1 text-red-600">
            Exit Chat
          </p>
        </div>
      )}
    </>
  );
};

export default RightSidebar;
