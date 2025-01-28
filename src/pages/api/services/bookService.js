import { collection, doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "firebaseConfig";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { userId,formData } = req.body;

    if (!formData) {
      return res
        .status(400)
        .json({ error: "User ID and form data are required." });
    }

    try {
      const bookingID = `BID${Date.now()}`;
      const bookingsRef = collection(db, "bookings");

      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        return res
          .status(500)
          .json({ error: "An error occurred while booking the service." });
      }

      const userDetails = userDoc.data();

      await setDoc(doc(bookingsRef, bookingID), {
        userId,
        ...formData,
        userDetails,
        bookingID,
        userDetails,
        status: "incoming",
        createdAt: Timestamp.now(),
      });

      res.status(200).json({ success: true, bookingID });
    } catch (error) {
      console.error("Error booking service:", error);
      res
        .status(500)
        .json({ error: "An error occurred while booking the service." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
