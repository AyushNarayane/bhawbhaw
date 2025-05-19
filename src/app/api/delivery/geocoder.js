/**
 * Utility functions for geocoding addresses
 */

/**
 * Get coordinates for an address using browser's Geocoding API
 * Note: In production, you might want to use a proper geocoding service like Google Maps Geocoding API
 * 
 * @param {string} address - Full address to geocode
 * @returns {Promise<{latitude: number, longitude: number}>} - Coordinates
 */
export async function geocodeAddress(address) {
  try {
    // For production, replace this with a call to a proper geocoding API
    // This is a simplistic implementation that won't work in server context
    
    // Example Google Maps Geocoding API usage:
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=YOUR_API_KEY`
    );
    
    const data = await response.json();
    
    if (data.status === "OK" && data.results && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry.location;
      return { 
        latitude: lat,
        longitude: lng
      };
    }
    
    throw new Error("Could not geocode address");
  } catch (error) {
    console.error("Error geocoding address:", error);
    // Return null or throw an error based on your error handling strategy
    return null;
  }
}

/**
 * Calculate distance between two points using the Haversine formula
 * 
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} - Distance in kilometers
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  // Convert latitude and longitude to radians
  const toRadians = (degree) => degree * (Math.PI / 180);
  const rlat1 = toRadians(lat1);
  const rlon1 = toRadians(lon1);
  const rlat2 = toRadians(lat2);
  const rlon2 = toRadians(lon2);

  // Haversine formula
  const dlon = rlon2 - rlon1;
  const dlat = rlat2 - rlat1;
  const a = 
    Math.sin(dlat/2)**2 +
    Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(dlon/2)**2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
  // Earth's radius in kilometers
  const R = 6371;
  const distance = R * c;
  
  return distance;
}

/**
 * Check if a delivery is considered "nearby" based on distance
 * 
 * @param {Object} storeCoordinates - Store coordinates {latitude, longitude}
 * @param {Object} deliveryCoordinates - Delivery coordinates {latitude, longitude}
 * @param {number} maxDistanceKm - Maximum distance to be considered "nearby" in kilometers
 * @returns {boolean} - Whether the delivery is considered "nearby"
 */
export function isNearbyDelivery(storeCoordinates, deliveryCoordinates, maxDistanceKm = 10) {
  if (!storeCoordinates?.latitude || !storeCoordinates?.longitude || 
      !deliveryCoordinates?.latitude || !deliveryCoordinates?.longitude) {
    return false;
  }
  
  const distance = calculateDistance(
    storeCoordinates.latitude, storeCoordinates.longitude,
    deliveryCoordinates.latitude, deliveryCoordinates.longitude
  );
  
  return distance <= maxDistanceKm;
} 