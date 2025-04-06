"use client"
import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const Home = () => {
    const router = useRouter()
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl bg-white p-6 rounded-lg shadow-lg"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Chatify</h1>
        <p className="text-gray-600 text-lg mb-6">Connect with your friends and chat in real-time with our seamless and secure chat platform.</p>
        <div className="flex gap-4 justify-center">
          <Button onClick={()=>router.push('/signup')} className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition">Sign Up</Button>
          <Button onClick={()=>router.push('/login')} className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition">Login</Button>
        </div>
      </motion.div>
    </main>
  );
};

export default Home;
