"use client";

import { Loader2 } from "lucide-react";
import React, { Suspense, lazy } from "react";
const RightSidebar = lazy(()=>import('./RightSidebar'))
const LeftSidebar = lazy(()=>import('./LeftSidebar'))


const Dashboard = () => {
  return (
    <main className="">
      <div className="flex min-h-screen">
        <Suspense fallback={  <div className="inset-0 fixed flex items-center justify-center bg-white/70 z-50">
      <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
    </div>}>
          <LeftSidebar />
        </Suspense>
        <Suspense fallback={  <div className="inset-0 fixed flex items-center justify-center bg-white/70 z-50">
      <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
    </div>}>
          <RightSidebar />
        </Suspense>
      </div>
    </main>
  );
};

export default Dashboard;
