import React from "react";

export const metadata = {
  title: "User Profile",
  description: "View and manage your profile details",
  keywords: "profile, user settings, account management"
};

const ProfileLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-poppins">
      <header className="bg-gray-100 shadow-md p-4">
        <h1 className="text-xl font-bold">Profile</h1>
      </header>

      <main className="flex-grow container mx-auto p-6">{children}</main>
    </div>
  );
};

export default ProfileLayout;
