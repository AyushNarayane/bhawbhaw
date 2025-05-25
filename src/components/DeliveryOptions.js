import React, { useEffect, useState } from 'react';
import { ClipLoader } from "react-spinners";
import { isNearbyDelivery } from '@/app/api/delivery/geocoder';

/**
 * Component for selecting delivery options (standard or Borzo nearby delivery)
 */
const DeliveryOptions = ({ 
  shippingAddress, 
  storeInfo,
  onSelectDeliveryOption,
  initialDeliveryFee = 15
}) => {
  const [deliveryOptions, setDeliveryOptions] = useState([
    {
      id: 'standard',
      name: 'Standard Delivery',
      description: 'Delivery within 2-3 days',
      price: initialDeliveryFee,
      selected: true
    },
    {
      id: 'borzo',
      name: 'Express Delivery (Borzo)',
      description: 'Delivery within 1-2 hours',
      price: null, // Will be calculated from Borzo API
      selected: false,
      available: false
    }
  ]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if Borzo delivery is available and calculate price
  useEffect(() => {
    const checkBorzoAvailability = async () => {
      if (!shippingAddress || !storeInfo) {
        console.log('DeliveryOptions: Missing shipping address or storeInfo:', { shippingAddress, storeInfo });
        setDeliveryOptions(prev => prev.map(opt => opt.id === 'borzo' ? {...opt, available: false, price: null} : opt));
        return;
      }

      setLoading(true);
      setError(null);

      try {
        let allVendorsInRange = true;
        let vendorsInRange = [];

        // Parse shipping address coordinates to numbers
        const deliveryCoords = {
          latitude: parseFloat(shippingAddress.latitude),
          longitude: parseFloat(shippingAddress.longitude)
        };

        // Check if storeInfo is a multi-vendor object
        const vendorIds = Object.keys(storeInfo);
        const isMultiVendor = vendorIds.length > 0 && typeof storeInfo[vendorIds[0]] === 'object' && storeInfo[vendorIds[0]] !== null;
        
        if (isMultiVendor) {
          console.log("DeliveryOptions: Multi-vendor detected. Checking range for vendors:", vendorIds);
          
          for (const vendorId of vendorIds) {
            const currentVendorInfo = storeInfo[vendorId];
            if (!currentVendorInfo) continue;

            // Parse vendor coordinates to numbers
            const vendorCoords = {
              ...currentVendorInfo,
              latitude: parseFloat(currentVendorInfo.latitude),
              longitude: parseFloat(currentVendorInfo.longitude)
            };

            if (isNaN(vendorCoords.latitude) || isNaN(vendorCoords.longitude)) {
              console.warn(`DeliveryOptions: Invalid coordinates for vendor ${vendorId}`, currentVendorInfo);
              allVendorsInRange = false;
              break;
            }

            const isVendorNearby = isWithinBorzoRange(vendorCoords, deliveryCoords);
            console.log(`DeliveryOptions: Vendor ${vendorId} within Borzo range:`, isVendorNearby, {
              store: { lat: vendorCoords.latitude, lng: vendorCoords.longitude },
              address: { lat: deliveryCoords.latitude, lng: deliveryCoords.longitude }
            });

            if (!isVendorNearby) {
              allVendorsInRange = false;
              break;
            }

            vendorsInRange.push({ ...vendorCoords, id: vendorId });
          }
        } else {
          // Single vendor case
          const vendorCoords = {
            ...storeInfo,
            latitude: parseFloat(storeInfo.latitude),
            longitude: parseFloat(storeInfo.longitude)
          };

          if (isNaN(vendorCoords.latitude) || isNaN(vendorCoords.longitude)) {
            console.warn("DeliveryOptions: Invalid coordinates for single vendor", storeInfo);
            allVendorsInRange = false;
          } else {
            allVendorsInRange = isWithinBorzoRange(vendorCoords, deliveryCoords);
            if (allVendorsInRange) {
              vendorsInRange.push(vendorCoords);
            }
            console.log('DeliveryOptions: Single vendor within Borzo range:', allVendorsInRange, {
              store: { lat: vendorCoords.latitude, lng: vendorCoords.longitude },
              address: { lat: deliveryCoords.latitude, lng: deliveryCoords.longitude }
            });
          }
        }

        if (allVendorsInRange && vendorsInRange.length > 0) {
          // Calculate Borzo delivery price for each vendor
          let totalDeliveryFee = 0;
          let maxEstimatedTime = 0;
          const borzoResponses = [];

          for (const vendorInfo of vendorsInRange) {
            const response = await fetch('/api/delivery/borzo/calculate-price', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                shippingAddress,
                storeInfo: vendorInfo,
                cartItems: [],
                userDetails: {
                  phone: shippingAddress.phone || '0000000000'
                },
                deliveryCoordinates: deliveryCoords
              }),
            });

            const data = await response.json();
            console.log(`DeliveryOptions: Borzo API price calculation response for vendor ${vendorInfo.id}:`, data);

            if (data.success) {
              totalDeliveryFee += data.deliveryFee;
              maxEstimatedTime = Math.max(maxEstimatedTime, data.deliveryTime?.minutes || 60);
              borzoResponses.push({
                vendorId: vendorInfo.id,
                ...data.borzoDetails
              });
            } else {
              throw new Error(`Failed to calculate price for vendor ${vendorInfo.id}`);
            }
          }

          setDeliveryOptions(prevOptions => 
            prevOptions.map(option => 
              option.id === 'borzo' 
                ? {
                    ...option,
                    price: totalDeliveryFee,
                    available: true,
                    estimatedTime: maxEstimatedTime,
                    borzoDetails: {
                      multiVendor: isMultiVendor,
                      vendorDetails: borzoResponses
                    }
                  }
                : option
            )
          );
        } else {
          console.log("DeliveryOptions: Borzo not available for one or more vendors.");
          setDeliveryOptions(prevOptions => 
            prevOptions.map(option => 
              option.id === 'borzo' 
                ? { ...option, available: false, price: null }
                : option
            )
          );
        }
      } catch (error) {
        console.error('DeliveryOptions: Error checking Borzo availability:', error);
        setError('Failed to check express delivery availability');
        setDeliveryOptions(prevOptions => 
          prevOptions.map(option => 
            option.id === 'borzo' 
              ? { ...option, available: false, price: null }
              : option
          )
        );
      } finally {
        setLoading(false);
      }
    };

    checkBorzoAvailability();
  }, [shippingAddress, storeInfo]);

  /**
   * Check if the delivery is within Borzo range
   * @param {Object} store - Single store object with latitude and longitude
   * @param {Object} address - Shipping address object with latitude and longitude
   */
  const isWithinBorzoRange = (store, address) => {
    // Ensure store and address objects and their coordinates are valid numbers
    if (store && !isNaN(store.latitude) && !isNaN(store.longitude) &&
        address && !isNaN(address.latitude) && !isNaN(address.longitude)) {
      
      console.log('isWithinBorzoRange: Calculating distance with:', {
        storeLat: store.latitude, storeLng: store.longitude,
        addressLat: address.latitude, addressLng: address.longitude
      });

      return isNearbyDelivery(
        { latitude: store.latitude, longitude: store.longitude },
        { latitude: address.latitude, longitude: address.longitude },
        10 // 10 km max distance
      );
    }
    
    // Fallback to postal code check if coordinates are invalid
    if (store?.postalCode && address?.postalCode) {
      console.warn('isWithinBorzoRange: Falling back to postal code check due to invalid coordinates.');
      return store.postalCode.substring(0, 3) === address.postalCode.substring(0, 3);
    }
    
    return false;
  };

  /**
   * Handle delivery option selection
   */
  const handleOptionSelect = (optionId) => {
    if (loading) return;
    
    const updatedOptions = deliveryOptions.map(option => ({
      ...option,
      selected: option.id === optionId
    }));
    
    setDeliveryOptions(updatedOptions);
    
    const selectedOption = updatedOptions.find(option => option.selected);
    onSelectDeliveryOption({
      type: selectedOption.id,
      price: selectedOption.price,
      borzoDetails: selectedOption.borzoDetails
    });
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-[#1D3178] mb-4">Delivery Options</h3>
      
      {error && (
        <p className="text-red-500 text-sm mb-2">{error}</p>
      )}
      
      <div className="space-y-3">
        {deliveryOptions.map((option) => (
          <div 
            key={option.id}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              option.selected 
                ? 'border-red-500 bg-red-50' 
                : 'border-gray-200 hover:border-red-300'
            } ${option.id === 'borzo' && !option.available ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => option.id !== 'borzo' || option.available ? handleOptionSelect(option.id) : null}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    option.selected ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  {option.selected && (
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  )}
                </div>
                
                <div>
                  <h4 className="font-medium">{option.name}</h4>
                  <p className="text-gray-500 text-sm">{option.description}</p>
                  
                  {option.id === 'borzo' && option.available && option.estimatedTime && (
                    <p className="text-green-600 text-xs mt-1">
                      Estimated delivery: ~{option.estimatedTime} minutes
                    </p>
                  )}
                  
                  {option.id === 'borzo' && !option.available && !loading && (
                    <p className="text-gray-500 text-xs mt-1">
                      Not available for your location
                    </p>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                {option.id === 'borzo' && loading ? (
                  <ClipLoader size={20} color="#FF5151" />
                ) : (
                  <span className="font-semibold">
                    {option.price ? `₹${option.price}` : '—'}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryOptions; 