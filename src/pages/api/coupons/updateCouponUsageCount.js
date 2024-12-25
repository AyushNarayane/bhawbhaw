    import { db } from "../../../../firebaseConfig";
    import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";

    export default async function updateCouponUsageCount(req, res) {
    if (req.method === "PATCH") {
        const { couponTitle } = req.body;
        if (!couponTitle) return res.status(400).json({ success: false, message: "Coupon Title is required" });

        try {
        const q = query(collection(db, "coupons"), where("couponTitle", "==", couponTitle));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            return res.status(404).json({ success: false, message: "Coupon not found" });
        }

        const couponDoc = snapshot.docs[0];
        const couponData = couponDoc.data();
        const couponRef = doc(db, "coupons", couponDoc.id);

        const newUsageCount = couponData.timesUsed + 1;

        await updateDoc(couponRef, { timesUsed: newUsageCount });

        return res.status(200).json({ success: true, message: "Coupon usage count updated", timesUsed: newUsageCount });
        } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
        }
    } else {
        return res.status(405).json({ success: false, message: "Method Not Allowed" });
    }
    }
