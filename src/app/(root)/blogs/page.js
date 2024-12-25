import AllBlogs from "@/components/Allblogs";
import Appointment from "@/components/Appointment";
import React from "react";

const page = () => {
  return (
    <div className="bg-white pb-10">
      <AllBlogs />
      <Appointment />
    </div>
  );
};

export default page;
