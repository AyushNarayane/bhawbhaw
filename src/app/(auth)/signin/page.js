'use client'
import React from "react";
import Image from "next/image";
import shape from "../../../../public/images/signin/shape.jpg";
import dog from "../../../../public/images/signin/dog.jpg";
import SignInForm from "./SignInForm";
import dynamic from "next/dynamic";

// Dynamically import the Google sign-in button component to ensure it's only loaded on client-side
const GoogleSignInButton = dynamic(() => import("./GoogleSignInButton"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center bg-white text-gray-700 font-semibold py-2 px-4 rounded-full shadow-md w-52">
      Loading...
    </div>
  ),
});

const Signin = () => {
  return (
    <div className="bg-[#FFB315] flex h-screen max-md:flex-col">
      <div className="basis-1/2 flex-1 bg-baw-yellow relative flex flex-col items-center max-md:hidden">
        <div className="flex flex-col">
          <Image
            src={shape}
            alt="Decorative Shape"
            width={420}
            height={420}
            className="object-contain sm:w-96 w-40"
          />
        </div>
        
        <div className="absolute z-10 sm:bottom-3/4 bottom-32 left-1/2 transform -translate-x-1/2">
          <GoogleSignInButton />
        </div>
        
        <div className="absolute sm:bottom-10 -bottom-[5.3rem] left-1/2 transform -translate-x-1/2 mt-4">
          <Image
            src={dog}
            alt="Dog Image"
            width={400}
            height={200}
            className="object-contain sm:w-80 w-40 mt-20"
          />
        </div>
      </div>
      <div className="text-[black] bg-white md:basis-1/2 flex-1 flex justify-center items-center h-full max-md:-mt-40 max-lg:w-full">
        <SignInForm />
      </div>
    </div>
  );
};

export default Signin;
