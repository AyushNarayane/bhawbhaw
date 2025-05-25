/**
 * Borzo Delivery API Client
 * This file contains utility functions for interacting with the Borzo API
 */

const BORZO_TEST_API_URL = "https://robotapitest-in.borzodelivery.com/api/business/1.6";
const BORZO_PROD_API_URL = "https://robot-in.borzodelivery.com/api/business/1.6";

// Use test environment for now as specified
const BORZO_API_URL = BORZO_TEST_API_URL;
const BORZO_AUTH_TOKEN = "2A447252CE669577DDF9D3B65170BFAC6D077830";

/**
 * Calculate delivery price using Borzo API
 * @param {Object} orderData - Order data containing delivery details
 * @returns {Promise<Object>} - Delivery price calculation result
 */
export async function calculateDeliveryPrice(orderData) {
  try {
    const response = await fetch(`${BORZO_API_URL}/calculate-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-DV-Auth-Token": BORZO_AUTH_TOKEN,
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();
    
    if (!data.is_successful) {
      throw new Error(data.warnings || "Failed to calculate delivery price");
    }

    return data;
  } catch (error) {
    console.error("Error calculating delivery price:", error);
    throw error;
  }
}

/**
 * Create a delivery order using Borzo API
 * @param {Object} orderData - Order data containing delivery details
 * @returns {Promise<Object>} - Created order details
 */
export async function createDeliveryOrder(orderData) {
  try {
    const response = await fetch(`${BORZO_API_URL}/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-DV-Auth-Token": BORZO_AUTH_TOKEN,
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();
    
    if (!data.is_successful) {
      throw new Error(data.errors || "Failed to create delivery order");
    }

    return data;
  } catch (error) {
    console.error("Error creating delivery order:", error);
    throw error;
  }
}

/**
 * Get order status using Borzo API
 * @param {number} orderId - Borzo order ID
 * @returns {Promise<Object>} - Order status details
 */
export async function getOrderStatus(orderId) {
  try {
    const response = await fetch(`${BORZO_API_URL}/order/status?order_id=${orderId}`, {
      method: "GET",
      headers: {
        "X-DV-Auth-Token": BORZO_AUTH_TOKEN,
      },
    });

    const data = await response.json();
    
    if (!data.is_successful) {
      throw new Error(data.errors || "Failed to get order status");
    }

    return data;
  } catch (error) {
    console.error("Error getting order status:", error);
    throw error;
  }
}

/**
 * Cancel an order using Borzo API
 * @param {number} orderId - Borzo order ID
 * @returns {Promise<Object>} - Cancellation result
 */
export async function cancelOrder(orderId) {
  try {
    const response = await fetch(`${BORZO_API_URL}/cancel-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-DV-Auth-Token": BORZO_AUTH_TOKEN,
      },
      body: JSON.stringify({ order_id: orderId }),
    });

    const data = await response.json();
    
    if (!data.is_successful) {
      throw new Error(data.errors || "Failed to cancel order");
    }

    return data;
  } catch (error) {
    console.error("Error canceling order:", error);
    throw error;
  }
}

/**
 * Format order data for Borzo API
 * @param {Object} orderDetails - Order details from the application
 * @returns {Object|Object[]} - Formatted order data for Borzo API, returns array if multiple vendors
 */
export function formatOrderDataForBorzo(orderDetails) {
  const { cartItems = [], shippingAddress, isMultiVendor } = orderDetails;
  
  // If multi-vendor, group items by vendor
  if (isMultiVendor) {
    // Group items by vendor
    const itemsByVendor = cartItems.reduce((acc, item) => {
      const vendorId = item.vendorId || item.vendorID;
      if (!acc[vendorId]) {
        acc[vendorId] = [];
      }
      acc[vendorId].push(item);
      return acc;
    }, {});

    // Format order for each vendor
    return Object.entries(itemsByVendor).map(([vendorId, vendorItems]) => {
      const vendorInfo = orderDetails.vendorInfo?.[vendorId] || {};
      
      // Calculate vendor-specific weight
      const vendorWeight = vendorItems.reduce(
        (sum, item) => sum + (item.weight || 0) * item.quantity,
        0
      ) || 1;

      // Create vendor-specific description
      const vendorItemsDescription = vendorItems.map(item => item.title).join(", ");

      return {
        type: "standard",
        matter: vendorItemsDescription,
        total_weight_kg: Math.max(vendorWeight, 1),
        vehicle_type_id: 8,
        is_client_notification_enabled: true,
        is_contact_person_notification_enabled: true,
        points: [
          {
            // Vendor pickup point
            address: vendorInfo.address,
            contact_person: {
              name: vendorInfo.contactName,
              phone: vendorInfo.contactPhone
            },
            latitude: vendorInfo.latitude,
            longitude: vendorInfo.longitude,
            client_order_id: `${orderDetails.orderId || 'tmp'}-${vendorId}-${orderDetails.transactionId || 'unknown'}`.substring(0, 40),
            note: `Vendor: ${vendorInfo.contactName}, Order: ${orderDetails.orderId || 'temp-order'}`
          },
          {
            // Customer delivery point
            address: `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.postalCode}`,
            contact_person: {
              name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
              phone: orderDetails.userDetails?.phone || '0000000000'
            },
            latitude: orderDetails.deliveryCoordinates?.latitude,
            longitude: orderDetails.deliveryCoordinates?.longitude,
            client_order_id: `${orderDetails.orderId || 'tmp'}-${vendorId}-${orderDetails.transactionId || 'unknown'}`.substring(0, 40),
            note: `Order: ${orderDetails.orderId || 'temp-order'}, Transaction: ${orderDetails.transactionId || 'unknown'}`
          }
        ]
      };
    });
  }
  
  // Single vendor order (existing logic)
  const storeInfo = orderDetails.storeInfo || {};
  const totalWeight = cartItems.reduce(
    (sum, item) => sum + (item.weight || 0) * item.quantity, 
    0
  ) || 1;
  
  const itemsDescription = cartItems.length > 0 
    ? cartItems.map(item => item.title).join(", ")
    : "Package delivery";
  
  const vendorId = storeInfo.id || 'unknown-vendor';
  
  return {
    type: "standard",
    matter: itemsDescription,
    total_weight_kg: Math.max(totalWeight, 1),
    vehicle_type_id: 8,
    is_client_notification_enabled: true,
    is_contact_person_notification_enabled: true,
    points: [
      {
        address: storeInfo.address,
        contact_person: {
          name: storeInfo.contactName,
          phone: storeInfo.contactPhone
        },
        latitude: storeInfo.latitude,
        longitude: storeInfo.longitude,
        client_order_id: `${orderDetails.orderId || 'tmp'}-${vendorId}-${orderDetails.transactionId || 'unknown'}`.substring(0, 40),
        note: `Vendor: ${storeInfo.contactName}, Order: ${orderDetails.orderId || 'temp-order'}`
      },
      {
        address: `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.postalCode}`,
        contact_person: {
          name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
          phone: orderDetails.userDetails?.phone || '0000000000'
        },
        latitude: orderDetails.deliveryCoordinates?.latitude,
        longitude: orderDetails.deliveryCoordinates?.longitude,
        client_order_id: `${orderDetails.orderId || 'tmp'}-${vendorId}-${orderDetails.transactionId || 'unknown'}`.substring(0, 40),
        note: `Order: ${orderDetails.orderId || 'temp-order'}, Transaction: ${orderDetails.transactionId || 'unknown'}`
      }
    ]
  };
} 