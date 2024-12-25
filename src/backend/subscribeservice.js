
import { db } from '../../firebaseConfig';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid'; // Make sure to install uuid package

export async function subscribeToNewsletter(email, source = 'website') {
  if (!email) throw new Error('Email is required');

  const collectionName = `subscribers_${source}`;

  // Generate a unique subscriber ID using uuid
  const subscriberId = uuidv4(); // Use uuid to generate a unique ID

  try {
    const docRef = doc(collection(db, collectionName), subscriberId);
    await setDoc(docRef, {
      subscriberId: subscriberId,
      email: email,
      subscriptionSource: source,
      timestamp: serverTimestamp()
    });
    return 'Subscribed successfully!';
  } catch (error) {
    console.error('Error adding document: ', error);
    throw new Error('Subscription failed. Please try again.');
  }
}
