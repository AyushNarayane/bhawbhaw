import { auth, db } from "../../../../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default async function signup(req, res) {
  if (req.method === "POST") {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
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

    } catch (error) {

      if (error.code === "auth/email-already-in-use") {
        return res.status(400).json({ success: false, message: "Email already in use" });
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
