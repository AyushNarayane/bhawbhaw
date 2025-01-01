import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { getDocs, query, collection, where } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { auth, db } from "../../firebaseConfig";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/userSlice";
import { ClipLoader } from "react-spinners";

const Protected = (WrappedComponent) => {
  const ComponentWithProtection = (props) => {
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        console.log(user);

        if (user) {
          try {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("uid", "==", user.uid));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
              const userDoc = querySnapshot.docs[0];
              const userData = userDoc.data();

              console.log(userData);
              dispatch(
                setUser({
                  userData: { ...userData },
                  userId: userDoc.id,
                })
              );
              
              setIsAuthorized(true);
            } else {
              toast.error("User not found.");
              auth.signOut();
              router.push("/signin");

              console.log("User not found. Logging out.");
            }
          } catch (error) {
            console.error("Error fetching user data: ", error);
            toast.error("An error occurred.");
            router.push("/signin");

            console.log("Error fetching user data. Logging out.");
          }
        } else {
          router.push("/signin");

          console.log("No user authenticated. Logging out.");
        }

        setLoading(false);
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

    return isAuthorized ? <WrappedComponent {...props} /> : null;
  };

  ComponentWithProtection.displayName = `Protected(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return ComponentWithProtection;
};

export default Protected;
