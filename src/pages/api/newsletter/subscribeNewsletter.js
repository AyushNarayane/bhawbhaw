import { db } from "../../../../firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

const subscribeNewsletter = async (req, res) => {
  if (req.method === "POST") {
    const { uid, email } = req.body;

    if (!uid || !email) {
      return res.status(400).json({ message: "UID and Email are required" });
    }

    try {
      const userDocRef = doc(db, "users", uid);

      await updateDoc(userDocRef, {
        isSubscribedToNewsletter: true,
      });

      return res.status(200).json({ message: "Subscribed successfully!" });
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
};

export default subscribeNewsletter;
