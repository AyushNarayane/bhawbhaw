import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "firebaseConfig";

export default async function handler(req, res) {
  try {
    const couponsRef = collection(db, "coupons");
    const couponsQuery = query(couponsRef, where("status", "==", "Active"));
    const couponsSnapshot = await getDocs(couponsQuery);

    const couponsList = couponsSnapshot.docs.map((doc) => ({
      id: doc.id,
      couponTitle: doc.data().couponTitle,
      discount: doc.data().discount,
      minPrice: doc.data().minPrice,
      timesUsed: doc.data().timesUsed,
      createdAt: doc.data().createdAt,
    }));

    res.status(200).json({ coupons: couponsList });
  } catch (error) {
    console.error("Error fetching coupons:", error);
    res.status(500).json({ error: "Failed to fetch coupons" });
  }
}
