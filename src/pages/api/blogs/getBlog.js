import { db } from '../../../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  const { slug } = req.query;

  if (!slug) {
    return res.status(400).json({ error: 'Blog slug is required' });
  }

  try {
    const blogRef = doc(db, 'blogs', slug);
    const blogSnap = await getDoc(blogRef);

    if (!blogSnap.exists()) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    return res.status(200).json({ data: { id: blogSnap.id, ...blogSnap.data() } });
  } catch (error) {
    console.error('Error fetching blog by slug:', error);
    return res.status(500).json({ error: 'Error fetching blog' });
  }
}
