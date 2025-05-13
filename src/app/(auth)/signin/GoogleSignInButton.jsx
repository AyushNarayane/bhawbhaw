"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "../../../../firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";

const GoogleSignInButton = () => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if this user already exists in Firestore
      const authUserRef = doc(db, "users", user.uid);
      const authUserSnap = await getDoc(authUserRef);

      let actualUserId;
      let isNewUser = false;

      if (!authUserSnap.exists()) {
        // New user - create a new custom userId
        isNewUser = true;
        const timestamp = Math.floor(Date.now() / 1000);
        actualUserId = `UID${timestamp}`;
        
        // Create a new document with custom userId as the document ID
        const newUserRef = doc(db, "users", actualUserId);
        
        // User data to store
        const userDataToStore = {
          userId: actualUserId,
          authUid: user.uid,
          email: user.email,
          displayName: user.displayName || "",
          username: user.displayName || "",
          photoURL: user.photoURL || "",
          createdAt: new Date().toISOString(),
        };
        
        // Set the user document
        await setDoc(newUserRef, userDataToStore);

        // Create a mapping document with auth UID as the document ID
        await setDoc(authUserRef, {
          mappedUserId: actualUserId,
          isAuthMapping: true,
          email: user.email,
          username: user.displayName || "",
          displayName: user.displayName || "",
          photoURL: user.photoURL || "",
        });
      } else {
        // Existing user - get the mapped userId or use the auth UID
        const authUserData = authUserSnap.data();
        
        if (authUserData.isAuthMapping && authUserData.mappedUserId) {
          // It's a mapping document, follow it to get the actual user data
          actualUserId = authUserData.mappedUserId;
          
          // Get the actual user data and check if it exists
          const actualUserRef = doc(db, "users", actualUserId);
          const actualUserSnap = await getDoc(actualUserRef);
          
          if (!actualUserSnap.exists()) {
            console.error("Mapped user document doesn't exist:", actualUserId);
            // Create it as a fallback
            const timestamp = Math.floor(Date.now() / 1000);
            actualUserId = `UID${timestamp}`;
            
            // Create a new document with custom userId as the document ID
            const newUserRef = doc(db, "users", actualUserId);
            
            // User data to store
            const userDataToStore = {
              userId: actualUserId,
              authUid: user.uid,
              email: user.email,
              displayName: user.displayName || "",
              username: user.displayName || "",
              photoURL: user.photoURL || "",
              createdAt: new Date().toISOString(),
            };
            
            // Set the user document
            await setDoc(newUserRef, userDataToStore);
            
            // Update the mapping
            await setDoc(authUserRef, {
              mappedUserId: actualUserId,
              isAuthMapping: true,
              email: user.email,
              username: user.displayName || "",
              displayName: user.displayName || "",
              photoURL: user.photoURL || "",
            });
          }
        } else if (authUserData.userId) {
          // For users created with the old format
          actualUserId = authUserData.userId;
        } else {
          // Fallback to auth UID if no userId found
          actualUserId = user.uid;
        }
      }

      // Store the actual userId in localStorage for easy access
      localStorage.setItem('currentUserId', actualUserId);
      
      // Also store in user format for compatibility
      const userData = {
        name: user.displayName || "",
        email: user.email,
        userId: actualUserId,
      };
      localStorage.setItem('user', JSON.stringify(userData));
      
      if (isNewUser) {
        toast.success("Account created successfully!");
      } else {
        toast.success("Signed in successfully!");
      }

      // Redirect to home page or dashboard
      router.push("/");
    } catch (error) {
      console.error("Error during Google sign in:", error);
      toast.error(error.message || "An error occurred during sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      disabled={loading}
      className="flex items-center justify-center bg-white text-gray-700 font-semibold py-2 px-4 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-300 w-52"
    >
      {loading ? (
        <span>Signing in...</span>
      ) : (
        <>
          <FcGoogle className="mr-2" size={20} />
          Sign in with Google
        </>
      )}
    </button>
  );
};

export default GoogleSignInButton; 