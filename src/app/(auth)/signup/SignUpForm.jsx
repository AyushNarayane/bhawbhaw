"use client";

import React, { useEffect, useState } from "react";
import logo from "../../../../public/images/signin/Group.jpg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { getDocs, collection, query, where } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/userSlice";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../../firebaseConfig";

const SignUpForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const combinedData = {
      username: username,
      email: email,
      password: password,
    };
  
    try {
      setLoading(true)
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(combinedData),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        toast.success(result.message);
        setUsername('');
        setEmail('');
        setPassword('');
        router.push('/signin')
      } else {
        toast.error(result.message || 'An error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Error during signup:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-lg w-3/4 mx-auto max-lg:w-full lg:pt-10 lg:px-20 lg:pb-10">
      <Toaster />
      <div className="flex justify-start mb-7">
        <Image src={logo} alt="Logo" width={200} height={80} className="h-20" />
      </div>
      <h2 className="text-left text-lg text-baw-light-gray mb-5">Create Your Account !!!</h2>
      <h1 className="text-left text-4xl font-bold mb-6">Sign Up</h1>
      <form className="mt-10" onSubmit={handleSubmit}>

        <div className="mb-4">
          <label className="block text-black text-sm mb-2 font-poppins" htmlFor="username">
            Username
          </label>
          <input
            type="text"
            id="username"
            className="w-full p-3 bg-gray-100 rounded-sm text-gray-900 focus:outline-none focus:border-red-400"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-black text-sm mb-2 font-poppins" htmlFor="email">
            Email
          </label>
          <input
            type="text"
            id="email"
            className="w-full p-3 bg-gray-100 rounded-sm text-gray-900 focus:outline-none focus:border-red-400"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-6 font-poppins mt-5">
          <label className="text-black text-sm mb-2 font-poppins flex justify-between" htmlFor="password">
            Password
          </label>
          <div className="flex justify-between items-center">
            <input
              type="password"
              id="password"
              className="w-full p-3 bg-gray-100 rounded-sm text-gray-900 focus:outline-none focus:border-red-400"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full flex justify-center lg:mt-10">
          <button
            type="submit"
            className="w-full lg:w-fit lg:rounded-full bg-red-500 text-white font-bold py-3 px-7 rounded-md flex justify-center items-center hover:bg-yellow-400"
            disabled={loading}
          >
            <span>{loading ? "Signing Up..." : "SIGN UP"}</span>
            <span className="ml-2">➔</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
