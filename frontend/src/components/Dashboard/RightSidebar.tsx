import React, { useEffect } from "react";
import { Input } from "../ui/input";
import { IoIosSend } from "react-icons/io";
import { useHandleApiCall } from "@/hooks/handleApiCall";

const RightSidebar = () => {
  const { authenticate } = useHandleApiCall();
  useEffect(() => {
    if (authenticate.isSuccess) {
      console.log("Authenticated user data: ", authenticate.data);
    }
  }, [authenticate]);

  return (
    <>
      {authenticate?.isLoading ? (
        <div className="flex-1 flex items-center justify-center italic h-screen">Loading...</div>
      ) : (
        <div className="flex-1">
          <div className="w-full text-white flex items-center justify-between px-5 py-3 h-16 bg-blue-500">
            <h1>user profile</h1>
            <div className="">icons</div>
          </div>
          <div className="flex flex-col bg-slate-300 min-h-[calc(100vh-64px)]">
            <div className=" p-5 overflow-y-auto h-[calc(100vh-134px)] ">messageContainer
               Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo, ducimus eos. Ullam, quia minus. Sapiente libero vitae nm delectus enim tenetur? Possimus ipsa consequuntur incidunt autem?
            </div>
            <div className="bg-blue-500 h-[70px] w-full  grid place-items-center  ">
              <form className="flex items-center w-full px-4 py-3 justify-evenly gap-2">
                <div className="flex-1 w-full text-white">
                  <Input className="text-lg" placeholder="Message" />
                </div>
                <div className="">
                  <IoIosSend
                    className="text-white cursor-pointer"
                    size={37}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RightSidebar;
