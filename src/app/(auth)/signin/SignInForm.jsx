"use client";

import React, { useEffect, useState } from "react";
import logo from "../../../../public/images/bhawbhawfavicon.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { getDocs, collection, query, where } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/userSlice";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../../../firebaseConfig";
import Link from "next/link";

const SignInForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userData);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && user?.name) {
        toast.success("Already logged in");
        router.push("/");
      }
    });
    return () => unsubscribe();
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        toast.error("No user found with this email");
        setLoading(false);
        return;
      }
  
      const userDoc = querySnapshot.docs[0];
      const userEmail = userDoc.data().email;
  
      await signInWithEmailAndPassword(auth, userEmail, password);
  
      const userData = {
        name: userDoc.data().username,
        email: email,
        userId: userDoc.id,
      };
  
      // Save user data to Redux
      dispatch(setUser({ userData }));
  
      // Save user data to localStorage
      localStorage.setItem("user", JSON.stringify(userData));
  
      toast.success("Login successful");
      router.push("/");
  
    } catch (error) {
      console.error("Error signing in:", error);
      toast.error("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };
  
  // Check user state on app load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
  
    if (storedUser) {
      const userData = JSON.parse(storedUser);
  
      dispatch(
        setUser({
          userData: {
            name: userData.name,
            email: userData.email,
          },
          userId: userData.userId,
        })
      );
  
      router.push("/"); // Redirect to home if user is already signed in
    }
  }, [dispatch, router]);  

  return (
    <div className="bg-white p-6 h-[600px] md:h-80 lg:h-3/4 rounded-3xl shadow-xl w-11/12 max-w-lg mx-auto mb-6 lg:mb-8 flex flex-col justify-evenly overflow-y-auto">
      <Toaster />
      <div className="flex justify-start">
        <Link href="/">
          <Image
            src={logo}
            alt="Logo"
            width={150}
            height={150}
            className="cursor-pointer"
          />
        </Link>
      </div>
      <h2 className="text-left text-lg text-baw-light-gray">Welcome back!!!</h2>
      <h1 className="text-left text-4xl font-bold">Sign in</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="">
          <label className="block text-black text-sm mb-2 font-poppins" htmlFor="email">
            Email
          </label>
          <input
            type="text"
            id="email"
            className="w-full p-3 bg-gray-100 rounded-sm text-gray-900 focus:outline-none focus:border-red-400"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="">
          <label className="text-black text-sm mb-2 font-poppins flex justify-between" htmlFor="password">
            Password
            <Link href="/forget" className="text-sm text-gray-500 ml-4">Forgot Password?</Link>
          </label>
          <div className="flex justify-between items-center bg-gray-100">
            <input
              type={showPassword ? "text" : "password"} // Toggle password visibility
              id="password"
              className="w-full p-3 bg-gray-100 rounded-sm text-gray-900 focus:outline-none focus:border-red-400"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="mx-4 text-gray-500"
            >
              <Image
                src={showPassword ? "/images/common/hide.png" : "/images/common/eye.png"}
                alt={showPassword ? "Show password" : "Hide password"}
                width={24}
                height={24}
              />
            </button>
          </div>
        </div>

        <div className="w-full flex justify-center mt-4">
          <button
            type="submit"
            className="w-fit rounded-full bg-red-500 text-white font-bold py-3 px-7 flex justify-center items-center hover:bg-yellow-400"
            disabled={loading}
          >
            <span>{loading ? "Signing In..." : "SIGN IN"}</span>
            <span className="ml-2">➔</span>
          </button>
        </div>
      </form>

      <div>
        <p className="text-center text-gray-500">
          <span>Don&apos;t have an account? </span>
          <Link href="/signup" className="text-red-500 font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

SignInForm.displayName = "SignInForm";

export default SignInForm;
