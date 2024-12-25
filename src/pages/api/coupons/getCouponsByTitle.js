import { db } from "../../../../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

export default async function getCoupons(req, res) {
  if (req.method === "GET") {
    const { couponTitle } = req.query;
    if (!couponTitle) {
      return res.status(400).json({ success: false, message: "Coupon Title is required" });
    }

    try {
      const q = query(collection(db, "coupons"), where("couponTitle", "==", couponTitle));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return res.status(404).json({ success: false, message: "No coupons found with the provided title" });
      }

      const coupons = snapshot.docs.map(doc => doc.data());
      return res.status(200).json({ success: true, coupons });
    } catch (error) {
      console.error("Error fetching coupons:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  } else {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
}
