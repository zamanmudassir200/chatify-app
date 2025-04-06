// src/app/page.tsx
import React from 'react';
import Home from '@/components/Home/Home';
import Navbar from '@/components/Navbar/Navbar';


const Page = () => {
  return (
      <div>
        <Navbar />
        <Home />
      </div>
  );
};

export default Page;
