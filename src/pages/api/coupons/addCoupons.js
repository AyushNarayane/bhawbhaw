import { db } from '../../../../firebaseConfig';
import { doc, setDoc, collection, getDocs, query, where } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { couponTitle, discount, minPrice, timesUsed, vendorId } = req.body;

      
      if (!couponTitle || !discount || !vendorId) {
        return res.status(400).json({ error: 'Required fields are missing' });
      }

     
      const couponsRef = collection(db, 'coupons');
      const q = query(couponsRef, where("couponTitle", "==", couponTitle));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        
        return res.status(400).json({ error: 'Coupon with this title already exists' });
      }

     
      const couponId = 'CID' + Math.floor(Date.now() / 1000);
      const newCoupon = {
        couponTitle,
        discount,
        vendorId,
        minPrice,
        timesUsed,
        createdAt: new Date(),
        status: "Active"
      };

     
      await setDoc(doc(db, 'coupons', couponId), newCoupon);

      return res.status(201).json({ message: 'Coupon added successfully', data: { ...newCoupon, id: couponId } });
    } catch (error) {
      console.error('Error adding coupon:', error);
      return res.status(500).json({ error: 'Error adding coupon' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
