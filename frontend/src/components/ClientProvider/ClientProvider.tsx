'use client';  // Client-side component

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState } from 'react';

interface Props{
    children :React.ReactNode
}

const ClientProvider = ({ children }: Props) => {
    const  [queryClient ] = useState(()=>new QueryClient())

  return (
    <>
      {/* Wrap children with QueryClientProvider */}
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </>
  );
};

export default ClientProvider;