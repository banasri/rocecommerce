"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { api } from "@/trpc/react";

export function Register() {
  const initialState = {
    username : "",
    password : "",
    email : ""
  }
  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  interface clientError {
    validation?: string;
    code: string;
    message: string;
    path?: string[];
    minimum?: number;
    type?: string;
    inclusive?: boolean;
    exact?: boolean;
  }
  const createUser = api.user.create.useMutation({
    onSuccess: async () => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('verificationProp', formData.email);
      }
      
      router.push('/verify');
    },
    onError: async (error ) => {
      //const errorStr = error.toString();
      console.log("signup error", error);
      if(error.message.includes("1")){
        setError("Please enter username");
      } else if (error.message.includes("Invalid email")){
        setError("Please provide a valid email");
      //console.log("typeof error", typeof errorStr);
      } else if(error.message.includes("6")) {
        setError("Password must contain at least 6 character(s)");
      } 
      
    },
    
  });

  return (
    <div className="w-full max-w-xs text-black">
      <div className="w-100 text-center mt-2">
        <p className="font-bold">Create your account</p>
        {error && <p className="text-red-500" >{error}</p>}
      </div>
      <form onSubmit={(e) => {
          e.preventDefault();
          createUser.mutate({ ...formData });
        }}
        className="flex flex-col gap-1 mt-2">
        <label htmlFor="name">Name</label>
          <input
          type="text"
          id="name"
          placeholder="username"
          value={formData.username}
          onChange={(e) => setFormData((prevVal) => { 
            return { ...prevVal, username: e.target.value}
          })}
          className="w-full rounded px-4 py-2 border-2 border-black-500 text-black"
        />
        <label htmlFor="email">Email</label>
        <input
          type="email"
          placeholder="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData((prevVal) => { 
            return { ...prevVal, email: e.target.value}
          })}
          className="w-full rounded px-4 py-2 border-2 border-black-500 text-black"
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          placeholder="password"
          value={formData.password}
          onChange={(e) => setFormData((prevVal) => { 
            return { ...prevVal, password: e.target.value}
          })}
          className="w-full rounded px-4 py-2 border-2 border-black-500 text-black"
        />
        <button
          type="submit"
          className="rounded-sm bg-black text-white mt-4 text-sm h-8"
          disabled={createUser.isPending}
        >
          {createUser.isPending ? "Creating..." : "CREATE ACCOUNT"}
        </button>
      <div className="w-100 text-center mt-2 text-xs">
      Have an account? <Link href="/login">LOGIN</Link>
      </div>
            
          </form>
      
    </div>
  );
}
