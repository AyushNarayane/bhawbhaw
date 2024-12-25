import { db } from '../../../../firebaseConfig';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { userId } = req.query;

    try {
      // Fetch user wishlist from 'users' collection
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        return res.status(404).json({ message: 'User not found' });
      }

      const userData = userDoc.data();
      const wishlist = userData.wishlist || [];

      // Fetch products from the 'products' collection based on wishlist items
      const productsRef = collection(db, 'products');
      const wishlistQuery = query(productsRef, where('id', 'in', wishlist));
      const wishlistSnapshot = await getDocs(wishlistQuery);

      const wishlistProducts = wishlistSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Fetch 'For You' products by category
      const categories = wishlistProducts.map(product => product.category); // Get categories from wishlist
      const forYouQuery = query(productsRef, where('category', 'in', categories));
      const forYouSnapshot = await getDocs(forYouQuery);

      const forYouProducts = forYouSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      res.status(200).json({
        wishlist: wishlistProducts,
        forYou: forYouProducts,
      });
    } catch (error) {
      console.error('Error fetching wishlist or for you products:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
