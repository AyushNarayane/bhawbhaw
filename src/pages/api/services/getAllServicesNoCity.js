import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../firebaseConfig';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const servicesCollection = collection(db, 'serviceProviders');
    const servicesSnapshot = await getDocs(servicesCollection);

    // Prepare all service docs
    const serviceDocs = servicesSnapshot.docs.map(serviceDoc => ({
      id: serviceDoc.id,
      ...serviceDoc.data(),
    }));

    // Only fetch vendor docs for those with vendorId
    const vendorFetches = serviceDocs
      .filter(service => service.vendorId)
      .map(service =>
        getDoc(doc(db, 'vendors', service.vendorId)).then(vendorDoc => ({
          service,
          vendorExists: vendorDoc.exists(),
        }))
      );

    // Wait for all vendor fetches in parallel
    const vendorResults = await Promise.all(vendorFetches);

    // Only include services where vendor exists
    const services = vendorResults
      .filter(result => result.vendorExists)
      .map(result => result.service);

    res.status(200).json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
} 