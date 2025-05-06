// "use client"
// import React from "react";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import { useRouter }from "next/navigation";


// const Navbar = () => {
//     const router = useRouter()
//   return (
//     <header className="h-20 w-full bg-blue-600 text-white flex items-center ">
//       <nav className="container flex items-center justify-between mx-auto">
//         <div className="">
//           <Link href={'/'} className="text-lg font-bold select-none">Chatify</Link>
//         </div>
//         <div className="flex gap-3">
//             <Button onClick={()=>router.push('/signup')} className="cursor-pointer" variant={'outline'}>Signup</Button>
//             <Button onClick={()=>router.push('/login')}  className="bg-white cursor-pointer text-black" variant={'secondary'}>Login</Button>
//         </div>
//       </nav>
//     </header>
//   );
// };

// export default Navbar;

"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Search } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const router = useRouter();

  return (
    <header className="h-20 w-full bg-blue-600 text-white flex items-center">
      <nav className="container px-10 sm:px-20 flex items-center justify-between mx-auto">
        <div>
          <Link href="/" className="text-lg font-bold select-none">Chatify</Link>
        </div>
        
        <div className="flex gap-4 items-center">
          {/* Explore Button */}
          <Button onClick={() => router.push('/explore')} className="cursor-pointer bg-white text-blue-600 font-semibold">
            Explore
          </Button>

          {/* Profile Dropdown */}
          <DropdownMenu>
          {/* <Search/> */}

            <DropdownMenuTrigger className="cursor-pointer">
              <User className="w-6 h-6 text-white" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white text-gray-800">
              <DropdownMenuItem onClick={() => router.push('/profile')}>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/settings')}>Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/logout')}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

