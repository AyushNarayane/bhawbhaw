// src/app/api/cart/route.js
import { db } from '../../../../firebaseConfig';
import { doc, getDoc, setDoc, deleteDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return new Response(JSON.stringify({ error: 'User ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const cartRef = collection(db, "users", userId, "cart");
    const cartSnapshot = await getDocs(cartRef);
    const items = cartSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return new Response(JSON.stringify(items), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request) {
  const { userId, productId, product, action } = await request.json();

  if (!userId || !productId) {
    return new Response(JSON.stringify({ error: 'User ID and Product ID are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const cartDocRef = doc(db, "users", userId, "cart", productId);

    if (action === 'add') {
      await setDoc(cartDocRef, {
        ...product,
        addedAt: serverTimestamp()
      });
    } else if (action === 'remove') {
      await deleteDoc(cartDocRef);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}