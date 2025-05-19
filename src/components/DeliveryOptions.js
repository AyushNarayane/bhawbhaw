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
      // Skip if we don't have valid shipping address
      if (!shippingAddress || !storeInfo) {
        console.log('Missing shipping address or store info:', { shippingAddress, storeInfo });
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        // Check if delivery distance is within Borzo range
        const isNearby = isWithinBorzoRange(storeInfo, shippingAddress);
        console.log('Is within Borzo range:', isNearby, {
          store: { lat: storeInfo.latitude, lng: storeInfo.longitude },
          address: { lat: shippingAddress.latitude, lng: shippingAddress.longitude }
        });
        
        if (isNearby) {
          // Calculate Borzo delivery price
          const response = await fetch('/api/delivery/borzo/calculate-price', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              shippingAddress,
              storeInfo,
              // Add minimal required details
              cartItems: [], // Empty array to prevent null errors
              userDetails: {
                phone: shippingAddress.phone || '0000000000'
              },
              deliveryCoordinates: {
                latitude: shippingAddress.latitude,
                longitude: shippingAddress.longitude
              }
            }),
          });

          const data = await response.json();
          console.log('Borzo API response:', data);

          if (data.success) {
            // Update Borzo delivery option
            setDeliveryOptions(prevOptions => 
              prevOptions.map(option => 
                option.id === 'borzo' 
                  ? {
                      ...option,
                      price: data.deliveryFee,
                      available: true,
                      estimatedTime: data.deliveryTime?.minutes || 60,
                      borzoDetails: data.borzoDetails
                    }
                  : option
              )
            );
          } else {
            // Borzo delivery not available
            setDeliveryOptions(prevOptions => 
              prevOptions.map(option => 
                option.id === 'borzo' 
                  ? {
                      ...option,
                      available: false,
                      price: null
                    }
                  : option
              )
            );
          }
        } else {
          // Not within Borzo range
          setDeliveryOptions(prevOptions => 
            prevOptions.map(option => 
              option.id === 'borzo' 
                ? {
                    ...option,
                    available: false,
                    price: null
                  }
                : option
            )
          );
        }
      } catch (error) {
        console.error('Error checking Borzo availability:', error);
        setError('Failed to check express delivery availability');
      } finally {
        setLoading(false);
      }
    };

    checkBorzoAvailability();
  }, [shippingAddress, storeInfo]);

  /**
   * Check if the delivery is within Borzo range
   */
  const isWithinBorzoRange = (store, address) => {
    // If we have coordinates, use isNearbyDelivery function
    if (store?.latitude && store?.longitude && 
        address?.latitude && address?.longitude) {
      return isNearbyDelivery(
        { latitude: store.latitude, longitude: store.longitude },
        { latitude: address.latitude, longitude: address.longitude },
        10 // 10 km max distance
      );
    }
    
    // If we don't have coordinates, default to checking postal codes
    // This is a simple implementation - you should use a proper geocoding service in production
    if (store?.postalCode && address?.postalCode) {
      return store.postalCode.substring(0, 3) === address.postalCode.substring(0, 3);
    }
    
    return false; // Default to not available
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