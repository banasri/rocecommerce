"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { api } from "@/trpc/react";

export function Login() {
  const initialState = {
    password : "",
    email : ""
  }
  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const utils = api.useUtils();
  const login = api.user.login.useMutation({
    onSuccess: async (res) => {
      setFormData(initialState);
      console.log("message", res);
      localStorage.setItem('verificationProp', formData.email);
      router.push('/product');
    },
    onError: async (error) => {
      console.log(error);
      setError(error.message);
      
      setTimeout(() =>{
        if(error.message === 'User not registered'){
          router.push('/');
        } else if(error.message === 'User not verified'){
          console.log('formData.email', formData.email);
          localStorage.setItem('verificationProp', formData.email);
          router.push('/verify');
        }
      })
    },
    
  });

  return (
    
    <div className="w-full max-w-xs text-black">
      {error && <p>{error}</p>}
      <div className="w-100 text-center mt-2">
        <p className="font-bold">Login</p>
        <p>Welcome back to ECOMMERCE</p>
        <p className="text-xs">The next gen business marketplace</p>
      </div>
      <form onSubmit={(e) => {
          e.preventDefault();
          login.mutate({ ...formData });
        }}
        className="flex flex-col gap-2 mt-4">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          placeholder="Enter"
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
          id="password"
          placeholder="Enter"
          value={formData.password}
          onChange={(e) => setFormData((prevVal) => { 
            return { ...prevVal, password: e.target.value}
          })}
          className="w-full rounded px-4 py-2 border-2 border-black-500 text-black"
        />
        <button
          type="submit"
          className="rounded-sm bg-black text-white mt-4 text-sm h-8"
          disabled={login.isPending}
        >
          {login.isPending ? "Logging in..." : "LOGIN"}
        </button>
        <hr className="border-gray mt-2" />
        <div className="w-100 text-center mt-2 text-xs">
        Don't have an account? <Link href="/">SIGN UP</Link>
      </div>
            
          </form>
      
    </div>
  );
}
