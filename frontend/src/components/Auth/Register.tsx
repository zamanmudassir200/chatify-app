"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useHandleApiCall } from "@/hooks/handleApiCall";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  consent: boolean;
}

const Register = () => {
  const { register } = useHandleApiCall();  // Access mutation result
  console.log("register",register)
  const [formData, setFormData] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    consent: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    register.mutate(formData);  // Trigger the mutation
  };

  return (
    <main className="flex bg-slate-400 items-center justify-center min-h-screen">
      <div className="bg-white p-5 mx-2 text-center rounded-md max-w-xl w-full">
        <h1 className="font-semibold my-4 text-xl">Register</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input type="text" placeholder="Name" name="name" value={formData.name} onChange={handleChange} />
          <Input type="email" placeholder="Email" name="email" value={formData.email} onChange={handleChange} />
          <Input type="password" placeholder="Password" name="password" value={formData.password} onChange={handleChange} />
          <Input type="text" placeholder="Phone" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />

          <label className="flex select-none text-sm sm:text-md gap-2">
            <input type="checkbox" name="consent" checked={formData.consent} onChange={handleChange} />
            I agree to the terms and conditions
          </label>

          <Button type="submit" className="text-lg font-semibold bg-blue-500 text-white" disabled={register.isPending}>
            {register.isPending ? "Signing up..." : "Sign up"}
          </Button>
        </form>
        <p className="my-3">
          Already have an account?{" "}
          <Link className="hover:underline text-blue-500 font-semibold" href={"/login"}>
            Login
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Register;
