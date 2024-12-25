import { db } from '../../firebaseConfig';
import { collection, getDocs, query, where, orderBy, limit, startAfter } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const {
      minPrice,
      maxPrice,
      category,
      subCategory,
      lastVisible,
      pageSize = 6
    } = req.query;

    try {
      let productsQuery = query(
        collection(db, 'products'),
        orderBy('price'), 
        limit(parseInt(pageSize))
      );

      if (minPrice) {
        productsQuery = query(productsQuery, where('price', '>=', parseInt(minPrice)));
      }
      if (maxPrice) {
        productsQuery = query(productsQuery, where('price', '<=', parseInt(maxPrice)));
      }
      if (category) {
        productsQuery = query(productsQuery, where('category', '==', category));
      }
      if (subCategory) {
        productsQuery = query(productsQuery, where('subCategory', '==', subCategory));
      }
      if (lastVisible) {
        const lastVisibleDoc = await db.collection('products').doc(lastVisible).get();
        if (lastVisibleDoc.exists) {
          productsQuery = query(productsQuery, startAfter(lastVisibleDoc));
        }
      }

      const productSnapshot = await getDocs(productsQuery);
      const products = productSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const newLastVisible = productSnapshot.docs[productSnapshot.docs.length - 1];

      res.status(200).json({
        products,
        lastVisible: newLastVisible ? newLastVisible.id : null
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
