"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { getDocs, collection, query, where } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/userSlice";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../../firebaseConfig";
import Link from "next/link";

const SignUpForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="bg-white p-6 h-fit rounded-3xl shadow-xl w-11/12 max-w-lg mx-auto mb-6 lg:mb-8 flex flex-col justify-around">
      <Toaster />
      <div className="flex flex-col mb-4">
      <div className="flex justify-start">
        <Link href="/">
          <Image
            src="/images/bhawbhawfavicon.png"
            alt="Logo"
            width={120}
            height={120}
            className="cursor-pointer"
          />
        </Link>
      </div>
      <h2 className="text-left text-base text-gray-500 md:mb-3">Create Your Account !!!</h2>
      <h1 className="text-left text-4xl font-bold md:mb-4">Sign Up</h1>
      </div>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-black text-sm lg:text-base mb-1 font-poppins" htmlFor="username">
            Username
          </label>
          <input
            type="text"
            id="username"
            className="w-full p-3 bg-gray-100 rounded-sm text-gray-900 focus:outline-none focus:border-red-400"
            placeholder="Enter your username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-black text-sm lg:text-base mb-1 font-poppins" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full p-3 bg-gray-100 rounded-sm text-gray-900 focus:outline-none focus:border-red-400"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-black text-sm lg:text-base mb-1 font-poppins" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="w-full p-3 bg-gray-100 rounded-sm text-gray-900 focus:outline-none focus:border-red-400 pr-10"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <Image
                src={showPassword ? "/images/common/hide.png" : "/images/common/eye.png"}
                alt={showPassword ? "Show password" : "Hide password"}
                width={20}
                height={20}
              />
            </button>
          </div>
        </div>
        <div className="w-full flex items-center justify-center mt-4">
          <button
            type="submit"
            className="w-fit rounded-full bg-red-500 text-white font-semibold px-6 py-3 flex justify-center items-center hover:bg-yellow-400"
            disabled={loading}
          >
            <span className="text-base">{loading ? "Signing Up..." : "SIGN UP"}</span>
            <span className="ml-2">➔</span>
          </button>
        </div>
        <div>
          <p className="text-center  text-gray-500">
            <span>Already have an account? </span>
            <Link href="/signin" className="text-red-500 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
