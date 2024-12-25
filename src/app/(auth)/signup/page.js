import React from "react";
import Image from "next/image";
import shape from "../../../../public/images/signin/shape.jpg";
import dog from "../../../../public/images/signin/dog.jpg";
import SignUpForm from "./SignUpForm";

const Signin = () => {
  return (
    <div className="bg-[#FFB315] flex md:h-screen h-auto max-md:flex-col">
      <div className="basis-1/2 flex-1  bg-baw-yellow relative flex flex-col items-center">
        <div className="absolute sm:bottom-10 -bottom-[5.3rem] left-1/2 transform -translate-x-1/2 mt-4">
          <Image
            src={dog}
            alt="Dog Image"
            width={400}
            height={200}
            className="object-contain sm:w-80 w-40 mt-20"
          />
        </div>
        <div className="flex flex-col">
          <Image
            src={shape}
            alt="Decorative Shape"
            width={420}
            height={420}
            className="object-contain sm:w-96 w-40"
          />
        </div>
      </div>
      <div className="bg-[white] text-[black] bg-baw-red md:basis-1/2 flex-1 flex justify-center items-center h-full max-lg:w-full">
        <SignUpForm/>
      </div>
    </div>
  );
};

export default Signin;
