import { db } from '../../../../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const {
      category,
      title,
      description,
      editorDescription,
      image,
      isFeatured,
      seo = {}, 
      slug,
      summary,
      tags,
      createdAt,
    } = req.body;

    if (!title || !slug || !description) {
      return res.status(400).json({ error: 'Title, slug, and description are required' });
    }
    const timestamp = Date.now();
    const documentId = `BID${timestamp}`;

    const seoData = {
      description: seo.description || '',
      image: seo.image || null,
      keywords: seo.keywords || [],
      author: seo.author || '',
      title: seo.title || '',
    };

    try {
      const blogRef = doc(db, 'blogs', documentId);
      await setDoc(blogRef, {
        category,
        title,
        description,
        editorDescription,
        image,
        isFeatured,
        seo: seoData,
        slug,
        summary,
        tags,
        createdAt,
      });

      return res.status(201).json({ message: 'Blog created successfully', id: documentId });
    } catch (error) {
      console.error('Error adding blog:', error);
      return res.status(500).json({ error: 'Error adding blog' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
