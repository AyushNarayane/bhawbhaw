import { db } from '../../../../firebaseConfig';
import { doc, setDoc, writeBatch } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const {
        userId,
        userDetails,
        cartItems,
        paymentMethod,
        shippingAddress: {
          firstName,
          lastName,
          address,
          apartment,
          state,
          city,
          postalCode,
          id
        },
        email,
        notification,
        totalAmount
      } = req.body;

      // Check if required fields are present
      if (!cartItems || !paymentMethod || !email || !firstName || !lastName || !address || !city || !state || !postalCode) {
        return res.status(400).json({ error: 'Required fields are missing' });
      }

      // Generate a unique order ID based on timestamp
      const orderId = 'OID' + Math.floor(Date.now() / 1000);

      // Order details to save to Firebase
      const order = {
        userId,
        userDetails,
        items: cartItems,
        totalAmount,
        paymentMethod,
        shippingAddress: {
          firstName,
          lastName,
          address,
          apartment,
          state,
          city,
          postalCode,
          email,
          id
        },
        notification: notification || '',  // Default to an empty string if not provided
        status: 'initialized',
        createdAt: new Date(),
      };

      // Start Firebase batch write for orders and checkout collections
      const batch = writeBatch(db);

      // Reference to the 'orders' collection in Firestore
      const orderRef = doc(db, 'orders', orderId);
      batch.set(orderRef, order);

      const checkoutRef = doc(db, 'checkout', orderId);
      batch.set(checkoutRef, {
        ...order,
        createdAt: new Date(),
        status: 'Initialized', 
      });

      // Commit the batch operation
      await batch.commit();

      // Return a success response after saving the order and checkout data
      return res.status(201).json({
        message: 'Checkout successful',
        orderId,
        order,
      });

    } catch (error) {
      console.error('Error during checkout:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    // Handle unsupported methods (only POST is allowed here)
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
