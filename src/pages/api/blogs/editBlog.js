import { db } from '../../../../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { slug } = req.query;
    const {
      category,
      title,
      description,
      editorDescription,
      image,
      isFeatured,
      seo = {}, 
      summary,
      tags,
      updatedAt,
    } = req.body;

    if (!slug) {
      return res.status(400).json({ error: 'Slug is required' });
    }

    const blogRef = doc(db, 'blogs', slug);

    try {
      
      const updateData = {};
      if (category) updateData.category = category;
      if (title) updateData.title = title;
      if (description) updateData.description = description;
      if (editorDescription) updateData.editorDescription = editorDescription;
      if (image) updateData.image = image;
      if (isFeatured) updateData.isFeatured = isFeatured;
      if (summary) updateData.summary = summary;
      if (tags) updateData.tags = tags;
      if (updatedAt) updateData.updatedAt = updatedAt;

     
      const seoData = {};
      if (seo.description) seoData.description = seo.description;
      if (seo.image) seoData.image = seo.image;
      if (seo.keywords) seoData.keywords = seo.keywords;
      if (seo.author) seoData.author = seo.author;
      if (seo.title) seoData.title = seo.title;

      if (Object.keys(seoData).length > 0) {
        updateData.seo = seoData;
      }

      await updateDoc(blogRef, updateData);

      return res.status(200).json({ message: 'Blog updated successfully' });
    } catch (error) {
      console.error('Error updating blog:', error);
      return res.status(500).json({ error: 'Error updating blog' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
