import React, { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import Link from 'next/link';

/**
 * Component for tracking Borzo delivery orders
 */
const DeliveryTracking = ({ orderId, borzoOrderId, order }) => {
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  // Status colors
  const statusColors = {
    new: 'bg-blue-100 text-blue-800',
    available: 'bg-blue-100 text-blue-800',
    active: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    canceled: 'bg-red-100 text-red-800',
    planned: 'bg-blue-100 text-blue-800',
    finished: 'bg-green-100 text-green-800',
  };

  useEffect(() => {
    // Fetch tracking data when component mounts
    if (borzoOrderId) {
      fetchTrackingData();
    }
    
    // Set up refresh interval
    const intervalId = setInterval(() => {
      if (borzoOrderId) {
        fetchTrackingData();
        setLastRefreshed(new Date());
      }
    }, refreshInterval * 1000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [borzoOrderId, refreshInterval]);
  
  /**
   * Fetch tracking data from the API
   */
  const fetchTrackingData = async () => {
    if (!borzoOrderId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/delivery/borzo/track?orderId=${borzoOrderId}`);
      const data = await response.json();
      
      if (data.success) {
        setTrackingData(data.orderStatus);
        
        // Adjust refresh interval based on delivery status
        if (
          data.orderStatus.status === 'active' || 
          data.orderStatus.points.some(point => point.status === 'active')
        ) {
          setRefreshInterval(15); // More frequent updates when active
        } else if (
          data.orderStatus.status === 'completed' || 
          data.orderStatus.status === 'canceled'
        ) {
          setRefreshInterval(0); // Stop refreshing when completed or canceled
        }
      } else {
        setError(data.message || 'Failed to track delivery');
      }
    } catch (error) {
      console.error('Error tracking delivery:', error);
      setError('Failed to track delivery. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Format date for display
   */
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // If no Borzo order ID is provided
  if (!borzoOrderId) {
    return (
      <div className="p-4 border rounded-lg bg-gray-50">
        <h3 className="font-semibold text-lg mb-2">Delivery Tracking</h3>
        <p className="text-gray-500">
          {order?.borzoDetails ? 
            "Order is being processed. Tracking will be available once a delivery partner is assigned." :
            "Standard delivery tracking is not available. Your order will be delivered within 2-3 days."
          }
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg bg-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Delivery Tracking</h3>
        
        <div className="flex items-center text-sm text-gray-500">
          {lastRefreshed && (
            <span>Updated: {lastRefreshed.toLocaleTimeString()}</span>
          )}
          
          <button 
            onClick={fetchTrackingData}
            className="ml-2 p-1 rounded-full hover:bg-gray-100"
            disabled={loading}
          >
            {loading ? (
              <ClipLoader size={16} color="#FF5151" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-800 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      {loading && !trackingData && (
        <div className="flex justify-center py-8">
          <ClipLoader size={24} color="#FF5151" />
        </div>
      )}
      
      {trackingData && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className={`px-3 py-1 rounded-full text-sm ${statusColors[trackingData.status] || 'bg-gray-100'}`}>
              {trackingData.statusDescription || trackingData.status}
            </div>
            
            {trackingData.trackingUrls && trackingData.trackingUrls.length > 0 && (
              <Link 
                href={trackingData.trackingUrls[0]} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-red-600 text-sm font-medium hover:underline"
              >
                Live Track
              </Link>
            )}
          </div>
          
          {trackingData.courier && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Delivery Executive</h4>
              <div className="flex items-center gap-3">
                {trackingData.courier.photo_url && (
                  <img 
                    src={trackingData.courier.photo_url} 
                    alt={trackingData.courier.name} 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-medium">{trackingData.courier.name} {trackingData.courier.surname}</p>
                  <p className="text-sm text-gray-500">{trackingData.courier.phone}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            {trackingData.points && trackingData.points.map((point, index) => (
              <div key={index} className="border-l-2 border-gray-200 pl-4">
                <div className="flex items-center gap-1 mb-1">
                  <span className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-green-500' : point.status === 'finished' ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                  <p className="font-medium">
                    {index === 0 ? 'Pickup' : `Delivery Point ${index}`}
                  </p>
                  
                  {point.status && (
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${statusColors[point.status] || 'bg-gray-100'}`}>
                      {point.status}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-1">{point.address}</p>
                
                {point.estimatedArrival && (
                  <p className="text-xs text-gray-500">
                    Estimated arrival: {formatDateTime(point.estimatedArrival)}
                  </p>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t text-sm text-gray-500">
            <p>Order ID: {orderId}</p>
            <p>Borzo Order ID: {trackingData.orderId}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryTracking; 