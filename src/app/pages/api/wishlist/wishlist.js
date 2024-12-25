// src/app/api/wishlist/route.js
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
    const wishlistRef = collection(db, "users", userId, "wishlist");
    const wishlistSnapshot = await getDocs(wishlistRef);
    const items = wishlistSnapshot.docs.map(doc => ({
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
    const wishlistDocRef = doc(db, "users", userId, "wishlist", productId);

    if (action === 'add') {
      await setDoc(wishlistDocRef, {
        ...product,
        addedAt: serverTimestamp()
      });
    } else if (action === 'remove') {
      await deleteDoc(wishlistDocRef);
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