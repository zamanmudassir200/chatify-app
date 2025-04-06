"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useHandleApiCall } from "@/hooks/handleApiCall"; // Using the same custom hook
import { LoginForm } from "../types/types";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";

const Login = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useHandleApiCall(); // Get mutation result

  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login.mutate(formData, {
      onSuccess: () => {
        setFormData({ email: "", password: "" });
        router.push("/dashboard");
      },
    });
  };

  return (
    <main className="flex bg-slate-400 items-center justify-center min-h-screen">
      <div className="bg-white p-5 mx-2 text-center rounded-md max-w-xl w-full">
        <h1 className="font-semibold my-4 text-xl">Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <div className="relative">
            <Input
              type={showPassword ? "text":"password"}
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <div className="absolute right-5 top-2 cursor-pointer" onClick={()=>setShowPassword(!showPassword)} >

            {showPassword ? <FaRegEye  /> : <FaRegEyeSlash />}
            </div>
          </div>

          <Button
            type="submit"
            className="text-lg font-semibold select-none bg-blue-500 text-white"
            disabled={login.isPending}
          >
            {login.isPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        <p className="my-3">
          Don't have an account?{" "}
          <Link
            className="hover:underline text-blue-500 font-semibold"
            href={"/signup"}
          >
            Register
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
