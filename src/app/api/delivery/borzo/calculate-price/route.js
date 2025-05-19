import { NextResponse } from "next/server";
import { calculateDeliveryPrice, formatOrderDataForBorzo } from "../borzoClient";

/**
 * API route handler to calculate delivery price using Borzo API
 * POST /api/delivery/borzo/calculate-price
 */
export async function POST(request) {
  try {
    // Parse the request body
    const orderDetails = await request.json();
    
    // Check if this is a nearby delivery (based on distance or user selection)
    const isNearbyDelivery = checkIfNearbyDelivery(orderDetails);
    
    // If not a nearby delivery, return standard delivery price
    if (!isNearbyDelivery) {
      return NextResponse.json({
        success: false,
        message: "This order does not qualify for nearby delivery with Borzo",
        deliveryFee: 15, // Default delivery fee
        isNearbyDelivery: false
      });
    }

    // Format the order data for Borzo API
    const borzoOrderData = formatOrderDataForBorzo(orderDetails);
    
    // Calculate delivery price
    const calculationResult = await calculateDeliveryPrice(borzoOrderData);
    
    // Return the delivery price and other details
    return NextResponse.json({
      success: true,
      deliveryFee: parseFloat(calculationResult.order.payment_amount),
      deliveryTime: estimateDeliveryTime(calculationResult.order),
      isNearbyDelivery: true,
      borzoDetails: {
        orderId: calculationResult.order.order_id,
        payment_amount: calculationResult.order.payment_amount,
        delivery_fee_amount: calculationResult.order.delivery_fee_amount,
        estimatedDeliveryTime: estimateDeliveryTime(calculationResult.order)
      }
    });
  } catch (error) {
    console.error("Error calculating Borzo delivery price:", error);
    
    // Return error response
    return NextResponse.json(
      {
        success: false,
        message: "Failed to calculate delivery price",
        error: error.message,
        deliveryFee: 15, // Default delivery fee as fallback
        isNearbyDelivery: false
      },
      { status: 500 }
    );
  }
}

/**
 * Check if the order qualifies for nearby delivery with Borzo
 * @param {Object} orderDetails - Order details
 * @returns {boolean} - Whether the order qualifies for nearby delivery
 */
function checkIfNearbyDelivery(orderDetails) {
  // Implement your logic to determine if the order qualifies for nearby delivery
  // For example, based on distance, item type, weight, etc.
  
  // For now, we'll consider all orders with coordinates as nearby deliveries
  return Boolean(
    orderDetails.deliveryCoordinates?.latitude && 
    orderDetails.deliveryCoordinates?.longitude &&
    orderDetails.storeInfo?.latitude &&
    orderDetails.storeInfo?.longitude
  );
}

/**
 * Estimate delivery time from Borzo API response
 * @param {Object} order - Borzo order object
 * @returns {Object} - Estimated delivery time details
 */
function estimateDeliveryTime(order) {
  // Extract delivery time details from Borzo order
  // For demo purposes, we'll use a fixed time window
  const currentTime = new Date();
  const estimatedDeliveryTime = new Date(currentTime.getTime() + 60 * 60 * 1000); // 1 hour later
  
  return {
    minutes: 60, // Estimated delivery time in minutes
    estimatedDeliveryTime: estimatedDeliveryTime.toISOString()
  };
} 