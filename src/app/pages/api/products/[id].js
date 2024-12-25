import { db } from '../../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const productRef = doc(db, 'products', id);
      const productDoc = await getDoc(productRef);

      if (productDoc.exists()) {
        res.status(200).json({ id: productDoc.id, ...productDoc.data() });
      } else {
        res.status(404).json({ error: 'Product not found' });
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
      res.status(500).json({ error: 'Failed to fetch product details' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
