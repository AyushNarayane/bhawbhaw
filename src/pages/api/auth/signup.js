import { auth, db } from "../../../../firebaseConfig";
import { createUserWithEmailAndPassword, getAuth, deleteUser } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default async function signup(req, res) {
  if (req.method === "POST") {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, "users", email));
      
      // If user exists in Firestore but not in Auth, we can proceed with signup
      if (!userDoc.exists()) {
        const docId = `UID${Math.floor(Date.now() / 1000)}`;

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, "users", docId), {
          username,
          email,
          createdAt: new Date(),
          userId: docId,
          uid: user.uid
        });

        return res.status(201).json({
          success: true,
          message: "User registered successfully",
        });
      } else {
        return res.status(400).json({ success: false, message: "User already exists" });
      }

    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        // If email is in use, try to delete the auth record and retry signup
        try {
          const auth = getAuth();
          const user = auth.currentUser;
          if (user) {
            await deleteUser(user);
          }
          // Retry signup
          const docId = `UID${Math.floor(Date.now() / 1000)}`;
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const newUser = userCredential.user;

          await setDoc(doc(db, "users", docId), {
            username,
            email,
            createdAt: new Date(),
            userId: docId,
            uid: newUser.uid
          });

          return res.status(201).json({
            success: true,
            message: "User registered successfully",
          });
        } catch (retryError) {
          return res.status(500).json({ success: false, message: "Error registering user", error: retryError.message });
        }
      }
      if (error.code === "auth/invalid-email") {
        return res.status(400).json({ success: false, message: "Invalid email address" });
      }
      return res.status(500).json({ success: false, message: "Error registering user", error: error.message });
    }
  } else {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
}
