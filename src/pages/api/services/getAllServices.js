import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../firebaseConfig';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ error: 'City parameter is required' });
  }

  try {
    // Get all service providers
    const servicesCollection = collection(db, 'serviceProviders');
    const servicesSnapshot = await getDocs(servicesCollection);

    const services = [];
    
    // Process each service provider
    for (const serviceDoc of servicesSnapshot.docs) {
      const serviceData = {
        id: serviceDoc.id,
        ...serviceDoc.data(),
      };

      // Check if service has vendorId
      if (serviceData.vendorId) {
        try {
          // Get vendor document from vendors collection
          const vendorDocRef = doc(db, 'vendors', serviceData.vendorId);
          const vendorDoc = await getDoc(vendorDocRef);

          if (vendorDoc.exists()) {
            const vendorData = vendorDoc.data();
            
            // Check if vendor has business details with city
            if (vendorData.businessDetails && vendorData.businessDetails.city) {
              const vendorCity = vendorData.businessDetails.city.toLowerCase();
              const searchCity = city.toLowerCase();
              
              // Check if city matches (case insensitive)
              if (vendorCity.includes(searchCity) || searchCity.includes(vendorCity)) {
                services.push(serviceData);
              }
            }
          }
        } catch (vendorError) {
          console.error(`Error fetching vendor ${serviceData.vendorId}:`, vendorError);
          // Continue with other services even if one vendor fails
        }
      }
    }

    res.status(200).json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
}
