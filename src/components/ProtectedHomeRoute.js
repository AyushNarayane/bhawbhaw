import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { getDocs, query, collection, where, doc, getDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { auth, db } from "../../firebaseConfig";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/userSlice";
import { ClipLoader } from "react-spinners";

const ProtectedHomeRoute = (WrappedComponent) => {
  const ComponentWithProtection = (props) => {
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
      // First check if we have a currentUserId in localStorage
      const currentUserId = localStorage.getItem("currentUserId");
      
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        console.log("Auth state changed:", user ? `User authenticated: ${user.uid}` : "No user");
        
        try {
          // If we have a currentUserId, use that directly first
          if (currentUserId) {
            console.log("Found currentUserId in localStorage:", currentUserId);
            const userDocRef = doc(db, "users", currentUserId);
            const userDocSnap = await getDoc(userDocRef);
            
            if (userDocSnap.exists()) {
              const userData = userDocSnap.data();
              console.log("User document found with currentUserId:", userData);
              
              dispatch(
                setUser({
                  userData: {
                    name: userData.username || userData.displayName || "",
                    email: userData.email,
                  },
                  userId: currentUserId,
                })
              );
              setUserData(userData);
              setLoading(false);
              return;
            } else {
              console.log("User document not found with currentUserId:", currentUserId);
              // Continue with auth check below
            }
          }
          
          // If there's no currentUserId or it didn't work, use auth user
          if (user) {
            console.log("Checking Firebase auth user:", user.uid);
            // First check if there's a mapping document for this auth user
            const authUserRef = doc(db, "users", user.uid);
            const authUserSnap = await getDoc(authUserRef);
            
            if (authUserSnap.exists()) {
              console.log("Found document for auth user:", user.uid);
              const authUserData = authUserSnap.data();
              
              // Check if it's a mapping document
              if (authUserData.isAuthMapping && authUserData.mappedUserId) {
                console.log("It's a mapping document, following to:", authUserData.mappedUserId);
                // Get the actual user document using mappedUserId
                const actualUserRef = doc(db, "users", authUserData.mappedUserId);
                const actualUserSnap = await getDoc(actualUserRef);
                
                if (actualUserSnap.exists()) {
                  const userData = actualUserSnap.data();
                  console.log("Found actual user document:", userData);
                  
                  // Update localStorage with the correct ID
                  localStorage.setItem("currentUserId", authUserData.mappedUserId);
                  
                  // Update user objects
                  const userDataForStore = {
                    name: userData.username || userData.displayName || "",
                    email: userData.email,
                    userId: authUserData.mappedUserId,
                  };
                  
                  localStorage.setItem("user", JSON.stringify(userDataForStore));
                  
                  dispatch(
                    setUser({
                      userData: {
                        name: userData.username || userData.displayName || "",
                        email: userData.email,
                      },
                      userId: authUserData.mappedUserId,
                    })
                  );
                  setUserData(userData);
                } else {
                  console.error("Mapped user document not found:", authUserData.mappedUserId);
                  toast.error("User data not found. Please sign in again.");
                  localStorage.removeItem("currentUserId");
                  localStorage.removeItem("user");
                  auth.signOut();
                  router.push("/signin");
                }
              } else {
                // It's a regular user document (old format)
                console.log("It's a regular user document (old format)");
                
                // Still store in localStorage for consistency
                localStorage.setItem("currentUserId", user.uid);
                
                const userDataForStore = {
                  name: authUserData.username || authUserData.displayName || "",
                  email: authUserData.email,
                  userId: user.uid,
                };
                
                localStorage.setItem("user", JSON.stringify(userDataForStore));
                
                dispatch(
                  setUser({
                    userData: {
                      name: authUserData.username || authUserData.displayName || "",
                      email: authUserData.email,
                    },
                    userId: user.uid,
                  })
                );
                setUserData(authUserData);
              }
            } else {
              // Try searching by authUid field as fallback
              console.log("No direct document for auth UID, searching by authUid field");
              const usersRef = collection(db, "users");
              const q = query(usersRef, where("authUid", "==", user.uid));
              const querySnapshot = await getDocs(q);

              if (!querySnapshot.empty) {
                console.log("Found user via authUid query");
                const userDoc = querySnapshot.docs[0];
                const userData = userDoc.data();
                
                // Update localStorage
                localStorage.setItem("currentUserId", userDoc.id);
                
                const userDataForStore = {
                  name: userData.username || userData.displayName || "",
                  email: userData.email,
                  userId: userDoc.id,
                };
                
                localStorage.setItem("user", JSON.stringify(userDataForStore));

                dispatch(
                  setUser({
                    userData: {
                      name: userData.username || userData.displayName || "",
                      email: userData.email,
                    },
                    userId: userDoc.id,
                  })
                );
                setUserData(userData);
              } else {
                console.error("User not found by any method");
                toast.error("User not found. Please sign in again.");
                localStorage.removeItem("currentUserId");
                localStorage.removeItem("user");
                auth.signOut();
                router.push("/signin");
              }
            }
          } else {
            console.log("No authenticated user and no currentUserId");
            // Not authenticated or no user data
            if (!userData) {
              router.push("/signin");
            }
          }
        } catch (error) {
          console.error("Error in ProtectedHomeRoute:", error);
          toast.error("An error occurred. Please try signing in again.");
          localStorage.removeItem("currentUserId");
          localStorage.removeItem("user");
          auth.signOut();
          router.push("/signin");
        } finally {
          setLoading(false);
        }
      });

      return () => unsubscribe();
    }, [dispatch, router]);

    if (loading) {
      return (
        <div className="fixed inset-0 flex justify-center items-center bg-white z-50">
          <ClipLoader size={50} color="#000" loading={loading} />
        </div>
      );
    }

    return (
      <WrappedComponent
        {...props}
        isAuthenticated={!!userData}
        userData={userData}
      />
    );
  };

  ComponentWithProtection.displayName = `ProtectedHomeRoute(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return ComponentWithProtection;
};

export default ProtectedHomeRoute;
