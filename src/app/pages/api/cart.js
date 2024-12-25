// pages/api/cart.js
import { db } from '../../../../firebaseConfig';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, productId, action } = req.body; // action can be 'addToCart' or 'addToWishlist'

    try {
      const userCartRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userCartRef);

      if (!userDoc.exists()) {
        // If user does not exist, create a new document
        await setDoc(userCartRef, {
          cart: [],
          wishlist: [],
        });
      }

      const userData = userDoc.data();

      if (action === 'addToCart') {
        if (!userData.cart.includes(productId)) {
          userData.cart.push(productId);
          await updateDoc(userCartRef, { cart: userData.cart });
        }
      } else if (action === 'addToWishlist') {
        if (!userData.wishlist.includes(productId)) {
          userData.wishlist.push(productId);
          await updateDoc(userCartRef, { wishlist: userData.wishlist });
        }
      }

      res.status(200).json({ message: 'Product added successfully' });
    } catch (error) {
      console.error('Error adding product:', error);
      res.status(500).json({ error: 'Failed to add product' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
