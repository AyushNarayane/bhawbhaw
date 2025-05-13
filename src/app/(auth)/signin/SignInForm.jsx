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

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
  //     if (currentUser && user?.name) {
  //       toast.success("Already logged in");
  //       router.push("/");
  //     }
  //   });
  //   return () => unsubscribe();
  // }, [user, router]);

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

      // Get the actual user document
      const userId = userDoc.id;
      const userDocData = userDoc.data();

      const userData = {
        name: userDocData.username || userDocData.displayName || "",
        email: email,
        userId: userId,
      };

      // Save user data to Redux
      dispatch(setUser({ userData }));

      // Save user data to localStorage (both formats for compatibility)
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("currentUserId", userId);

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
    // Try to get currentUserId first (new format)
    const currentUserId = localStorage.getItem("currentUserId");
    if (currentUserId) {
      // Simply redirect to home page, ProtectedHomeRoute will handle data fetching
      router.push("/");
      return;
    }
    
    // Fall back to user object (old format)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
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
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, [dispatch, router]);

  return (
    <div className="bg-white px-6 py-10 h-fit rounded-3xl shadow-xl w-11/12 mx-2 max-w-md mb-6 lg:mb-8 flex flex-col justify-around">
      <Toaster />
      <div className="flex flex-col mb-4">
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
        <h1 className="text-left text-3xl sm:text-4xl font-bold">Sign in</h1>
      </div>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
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

        <div>
          <label className="text-black text-sm mb-2 font-poppins flex justify-between" htmlFor="password">
            Password
            <Link href="/forget" className="text-sm text-gray-500 ml-4">Forgot Password?</Link>
          </label>
          <div className="flex justify-between items-center bg-gray-100 rounded-sm">
            <input
              type={showPassword ? "text" : "password"}
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
            className="w-full sm:w-fit rounded-full bg-red-500 text-white font-bold py-3 px-7 flex justify-center items-center hover:bg-yellow-400"
            disabled={loading}
          >
            <span>{loading ? "Signing In..." : "SIGN IN"}</span>
            <span className="ml-2">➔</span>
          </button>
        </div>

        <div>
          <p className="text-center text-gray-500">
            <span>Don&apos;t have an account? </span>
            <Link href="/signup" className="text-red-500 font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

SignInForm.displayName = "SignInForm";

export default SignInForm;
