'use client'

import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "firebaseConfig";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState()

  useEffect(() => {
    const fetchUserFromLocalStorage = () => {
      // Try to get userId from currentUserId first (new format)
      const currentUserId = localStorage.getItem("currentUserId");
      if (currentUserId) {
        setUserId(currentUserId);
        return;
      }
      
      // Fall back to user object (old format)
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUserId(parsedUser.userId);
        } catch (error) {
          console.error("Error parsing user from localStorage:", error);
        }
      }
    };

    fetchUserFromLocalStorage();
  }, []);

  useEffect(() => {
    const fetchUserDataFromFirestore = async () => {
      if (!userId) return;

      try {
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          console.log("User document does not exist.");
        }
      } catch (error) {
        console.log("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDataFromFirestore();
  }, [userId]);

  if (loading) {
    return <p className="font-poppins text-xl">Loading...</p>
  }

  if (!userData) {
    return <p className="font-poppins text-xl">User data not found. Please sign in again.</p>
  }

  return (
    <div className="bg-white shadow rounded-lg p-6 font-poppins">
      <h2 className="text-lg font-bold mb-4">Profile Information</h2>
      <div className="space-y-2">
        <p>
          <span className="font-semibold">User ID:</span> {userData.userId}
        </p>
        <p>
          <span className="font-semibold">Username:</span> {userData.username || userData.displayName}
        </p>
        <p>
          <span className="font-semibold">Email:</span> {userData.email}
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;
