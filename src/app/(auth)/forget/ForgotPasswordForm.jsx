'use client'
import React, { useState } from "react";
import { toast } from "react-toastify";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from "../../../../firebaseConfig";
import { getDocs, collection, query, where } from "firebase/firestore";
import Link from "next/link"; 
import Image from "next/image";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false)

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)

      // check if user exists
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error("No user found with this email");
        setLoading(false);
        return;
      }

      // send mail if user exists
      await sendPasswordResetEmail(auth, email);
      toast.success("Check your email for further instructions");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send reset email. Please try again.");
    }

    setLoading(false)
  };

  return (
    <div className="bg-white max-h-screen p-8 rounded-3xl shadow-lg w-3/4 my-8 mx-4 max-lg:w-full lg:pt-10 lg:px-20 lg:pb-32">
      <div className="flex justify-start mb-7">
        <Link href="/">
          <Image
            src='/images/bhawbhawfavicon.png'
            alt="Logo"
            width={150}
            height={150}
            className="cursor-pointer"
          />
        </Link>
      </div>
      <h2 className="text-left text-lg text-baw-light-gray mb-5">Reset Your Password</h2>
      <h1 className="text-left text-sm font-bold mb-6">Enter your email address to receive password reset instructions.</h1>
      <form className="mt-10" onSubmit={handlePasswordReset}>
        <div className="mb-4">
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
        <div className="w-full flex justify-center lg:mt-10">
          <button
            type="submit"
            className="w-full lg:w-fit lg:rounded-full bg-red-500 text-white font-bold py-3 px-7 rounded-md flex justify-center items-center hover:bg-yellow-400"
            disabled={loading}
          >
            <span>{loading ? "Loadind..." : "Send Link"}</span>
            <span className="ml-2">➔</span>
          </button>
        </div>
      </form>

      <div>
        <p className="text-center mt-4 text-gray-500">
          <span>Back to login? </span>
          <Link href="/signin" className="text-red-500 font-semibold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}

export default ForgotPasswordForm;