"use client";

import { useHandleApiCall } from "@/hooks/handleApiCall";
import { useChatStore } from "@/store/useChatStore";
import { Loader2 } from "lucide-react";
import React, { Suspense, lazy, useEffect, useRef, useState } from "react";
// import { socket } from "./RightSidebar";
// import io from "socket.io-client";
const RightSidebar = lazy(() => import("./RightSidebar"));
const LeftSidebar = lazy(() => import("./LeftSidebar"));

// import RightSidebar from "./RightSidebar";
// import LeftSidebar from "./LeftSidebar";

const Dashboard = () => {
  // const { selectedItem, setOnlineUsers } = useChatStore();
  // const { authenticate } = useHandleApiCall();

  // useEffect(() => {
  //   const handleBeforeUnload = () => {
  //     socket.current.disconnect(); // force disconnection on unload
  //   };

  //   window.addEventListener("beforeunload", handleBeforeUnload);
  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, []);

  return (
    <main className="">
      <div className="flex min-h-screen">
        <Suspense
          fallback={
            <div className="inset-0 fixed flex items-center justify-center bg-white/70 z-50">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            </div>
          }
        >
          <LeftSidebar />
        </Suspense>
        <Suspense
          fallback={
            <div className="inset-0 fixed flex items-center justify-center bg-white/70 z-50">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            </div>
          }
        >
          <RightSidebar />
        </Suspense>
      </div>
    </main>
  );
};

export default Dashboard;
