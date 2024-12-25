"use client";

import React, { useEffect, useState } from "react";
import logo from "../../../../public/images/signin/Group.jpg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { getDocs, collection, query, where } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/userSlice";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../../../firebaseConfig";

const SignInForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userData);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

      dispatch(
        setUser({
          userData: {
            name: userDoc.data().name,
            email: email,
          },
          userId: userDoc.id,
        })
      );

      toast.success("Login successful");
      router.push("/");

    } catch (error) {
      console.error("Error signing in:", error);
      toast.error("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white max-h-screen p-8 rounded-3xl shadow-lg w-3/4 mx-auto max-lg:w-full lg:pt-10 lg:px-20 lg:pb-32">
      <Toaster />
      <div className="flex justify-start mb-7">
        <Image src={logo} alt="Logo" width={200} height={80} className="h-20" />
      </div>
      <h2 className="text-left text-lg text-baw-light-gray mb-5">Welcome back !!!</h2>
      <h1 className="text-left text-4xl font-bold mb-6">Sign in</h1>
      <form className="mt-10" onSubmit={handleSubmit}>
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

        <div className="mb-6 font-poppins mt-10">
          <label className="text-black text-sm mb-2 font-poppins flex justify-between" htmlFor="password">
            Password
            <a href="#" className="text-sm text-gray-500 ml-4">Forgot Password?</a>
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
            <span>{loading ? "Signing In..." : "SIGN IN"}</span>
            <span className="ml-2">➔</span>
          </button>
        </div>
      </form>
    </div>
  );
};

SignInForm.displayName = "SignInForm"; 

export default SignInForm;
