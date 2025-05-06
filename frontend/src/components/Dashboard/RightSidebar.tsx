// import React, { useEffect, useRef, useState } from "react";
// import { Input } from "../ui/input";
// import { IoIosSend } from "react-icons/io";
// import { useHandleApiCall } from "@/hooks/handleApiCall";
// import { useChatStore } from "@/store/useChatStore";
// import { Message } from "../types/types";
// import { fetchMessages } from "@/services/chatServices";

// const RightSidebar = () => {
//   const { authenticate, handleSendMessage } = useHandleApiCall();
//   const [messages, setMessages] = useState<Message[]>([]);

//   const { selectedItem } = useChatStore();
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     if (authenticate.isSuccess) {
//       console.log("Authenticated user data: ", authenticate.data);
//     }
//   }, [authenticate.isSuccess]);

//   const handleSubmitSendMessage = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log("Form Submitted ✅");
//     console.log("messageContent:", message);

//     console.log("selectedItem:", selectedItem);
//     console.log("Auth user ID:", authenticate?.data?.data?._id);

//     if (
//       !message.trim() ||
//       !selectedItem?._id ||
//       !authenticate?.data?.data?._id
//     ) {
//       console.log("❌ Required data missing");
//       return;
//     }

//     const messageData: Message = {
//       sender: authenticate?.data?.data?._id,
//       content: message,
//       chat: selectedItem._id,
//     };

//     console.log("Sending Message:", messageData);

//     handleSendMessage.mutate(messageData, {
//       onSuccess: (data) => {
//         console.log("✅ Message sent successfully", data);
//         setMessages((prev) => [...prev, data?.msg]); // Add new message to list

//         // Emit new message via socket to other users
//       },
//       onError: (error) => {
//         console.error("❌ Message send error", error);
//       },
//     });

//     setMessage(""); // clear input
//   };
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   useEffect(() => {
//     const loadMessages = async () => {
//       if (selectedItem?._id) {
//         try {
//           const msgs = await fetchMessages(selectedItem._id);
//           console.log("msgs", msgs);
//           setMessages(msgs);
//         } catch (error) {
//           console.error("Failed to load messages", error);
//         }
//       }
//     };

//     loadMessages();
//   }, [selectedItem]);

//   console.log("messages", messages);

//   return (
//     <>
//       {authenticate?.isLoading ? (
//         <div className="flex-1 flex items-center justify-center italic h-screen">
//           Loading...
//         </div>
//       ) : (
//         <div className="flex-1">
//           <div className="w-full text-white flex items-center justify-between px-5 py-3 h-16 bg-blue-500">
//             <h1>{selectedItem?.chatName}</h1>
//             <div className="">icons</div>
//           </div>
//           <div className="flex flex-col bg-slate-300 min-h-[calc(100vh-64px)]">
//             <div className="p-5 overflow-y-auto h-[calc(100vh-134px)] space-y-2">
//               {authenticate.isSuccess &&
//                 messages.map((msg, index) => (
//                   <div
//                     key={index}
//                     className={`p-2 rounded-md max-w-[70%] ${
//                       authenticate?.data?.data?._id === msg.sender
//                         ? "bg-green-500 ml-auto"
//                         : "bg-white"
//                     }`}
//                   >
//                     {msg.content}
//                   </div>
//                 ))}

//               <div ref={messagesEndRef} />
//             </div>

//             <div className="bg-blue-500 h-[70px] w-full grid place-items-center">
//               <form
//                 onSubmit={handleSubmitSendMessage}
//                 className="flex items-center w-full px-4 py-3 justify-evenly gap-2"
//               >
//                 <div className="flex-1 w-full text-white">
//                   <Input
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     className="text-lg"
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
//         </div>
//       )}
//     </>
//   );
// };

// export default RightSidebar;

"use client";

import React, { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { FaUser } from "react-icons/fa";

import { IoIosSend } from "react-icons/io";
import { useHandleApiCall } from "@/hooks/handleApiCall";
import { useChatStore } from "@/store/useChatStore";
import { Message } from "../types/types";
import { fetchMessages } from "@/services/chatServices";
import { generateChatRoomId } from "@/utils/chatRoom"; // Add this import at top
import { IoClose } from "react-icons/io5";

import { Button } from "../ui/button";

const RightSidebar = () => {
  const { authenticate, handleSendMessage } = useHandleApiCall();
  const [messages, setMessages] = useState<Message[]>([]);
  const { selectedItem, setSelectedItem } = useChatStore();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (authenticate.isSuccess) {
      console.log("Authenticated user data: ", authenticate.data);
    }
  }, [authenticate.isSuccess]);

  const handleSubmitSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !message.trim() ||
      !selectedItem?._id ||
      !authenticate?.data?.data?._id
    ) {
      console.log("❌ Required data missing");
      return;
    }

    const messageData: Message = {
      sender: authenticate?.data?.data?._id,
      content: message,
      chat: selectedItem._id,
    };

    // Send to server via REST API
    handleSendMessage.mutate(messageData, {
      onSuccess: (data) => {
        setMessages((prev) => [...prev, data?.msg]);

        // // Send to others via socket
        // const socket = getSocket();
        // if (chatRoomId) {
        //   socket.emit("sendMessage", { ...data?.msg, chat: chatRoomId });
        // }
        const receiverId = selectedItem?.users?.find(
          (user: any) => user._id !== authenticate?.data?.data?._id
        )?._id;
      },
      onError: (error) => {
        console.error("❌ Message send error", error);
      },
    });

    setMessage("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const loadMessages = async () => {
      if (selectedItem?._id) {
        try {
          const msgs = await fetchMessages(selectedItem._id);
          setMessages(msgs);
        } catch (error) {
          console.error("Failed to load messages", error);
        }
      }
    };

    loadMessages();
  }, [selectedItem]);

  const currentUserId = authenticate?.data?.data?._id;
  const targetUserId = selectedItem?.users?.find(
    (user: any) => user._id !== currentUserId
  )?._id;

  const chatRoomId =
    currentUserId && targetUserId
      ? generateChatRoomId(currentUserId, targetUserId)
      : null;

  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleClickOutside = () => setShowContextMenu(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);
  const handleExitChat = () => {
    setSelectedItem(null); // this triggers your placeholder UI
    setShowContextMenu(false);
  };

  return (
    <>
      {selectedItem === null ? (
        <div className="flex-1 bg-slate-300 min-h-screen flex flex-col items-center justify-center">
          {/* Header style match */}
          <div className="w-full text-white flex items-center justify-between px-5 py-3 h-16 bg-blue-500"></div>

          {/* Main placeholder content */}
          <div className="flex-1 w-full flex flex-col items-center justify-center">
            {/* <div className="mb-5">
             <Image
               src="/chat-logo.png" // Use a logo placed in your /public folder
               alt="Chat Logo"
               width={100}
               height={100}
               className="object-contain"
             />
           </div> */}
            <h2 className="text-2xl text-gray-700 font-semibold">
              Select a chat to start messaging
            </h2>
            <p className="text-gray-500 mt-2 text-sm">
              Your conversations will appear here
            </p>
          </div>
        </div>
      ) : (
        <div
          className="flex-1"
          onContextMenu={(e) => {
            e.preventDefault();
            setContextMenuPosition({ x: e.clientX, y: e.clientY });
            setShowContextMenu(true);
          }}
        >
          <div className="w-full text-white flex items-center justify-between px-5 py-3 h-16 bg-blue-500">
            <h1>{selectedItem?.chatName}</h1>
            <Button>
              <FaUser />{" "}
            </Button>
            <div className="">icons</div>
            <div className="">
              <IoClose className="cursor-pointer" onClick={()=>{
                setSelectedItem(null)
              }}  size={24}/>
            </div>
          </div>
          <div className="flex flex-col bg-slate-300 min-h-[calc(100vh-64px)]">
            <div className="p-5 overflow-y-auto h-[calc(100vh-134px)] space-y-2">
              {authenticate.isSuccess &&
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded-md max-w-[70%] ${
                      authenticate?.data?.data?._id === msg.sender
                        ? "bg-green-500 ml-auto"
                        : "bg-white"
                    }`}
                  >
                    {msg.content}
                  </div>
                ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="bg-blue-500 h-[70px] w-full grid place-items-center">
              <form
                onSubmit={handleSubmitSendMessage}
                className="flex items-center w-full px-4 py-3 justify-evenly gap-2"
              >
                <div className="flex-1 w-full text-white">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="text-lg"
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
      )}
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
