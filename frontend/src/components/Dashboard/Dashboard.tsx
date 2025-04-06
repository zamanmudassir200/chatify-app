"use client";

import React from "react";
import RightSidebar from "./RightSidebar";
import LeftSidebar from "./LeftSidebar";

const Dashboard = () => {

  return (
    <main className="">
      <div className="flex min-h-screen">
        <LeftSidebar />
        <RightSidebar />
      </div>
    </main>
  );
};

export default Dashboard;
