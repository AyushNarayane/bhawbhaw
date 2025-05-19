import { NextResponse } from "next/server";
import { createDeliveryOrder, formatOrderDataForBorzo } from "../borzoClient";

/**
 * API route handler to create delivery order using Borzo API
 * POST /api/delivery/borzo/create-order
 */
export async function POST(request) {
  try {
    // Parse the request body
    const orderDetails = await request.json();
    
    // Check if this is a nearby delivery
    const isNearbyDelivery = checkIfNearbyDelivery(orderDetails);
    
    // If not a nearby delivery, return error
    if (!isNearbyDelivery) {
      return NextResponse.json({
        success: false,
        message: "This order does not qualify for nearby delivery with Borzo",
        isNearbyDelivery: false
      });
    }

    // Format the order data for Borzo API
    const borzoOrderData = formatOrderDataForBorzo(orderDetails);
    
    // Create delivery order
    const orderResult = await createDeliveryOrder(borzoOrderData);
    
    // Return the order details
    return NextResponse.json({
      success: true,
      message: "Borzo delivery order created successfully",
      isNearbyDelivery: true,
      borzoOrderDetails: {
        orderId: orderResult.order.order_id,
        orderName: orderResult.order.order_name,
        status: orderResult.order.status,
        statusDescription: orderResult.order.status_description,
        paymentAmount: orderResult.order.payment_amount,
        deliveryFeeAmount: orderResult.order.delivery_fee_amount,
        trackingUrls: orderResult.order.points.map(point => point.tracking_url).filter(Boolean)
      }
    });
  } catch (error) {
    console.error("Error creating Borzo delivery order:", error);
    
    // Return error response
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create delivery order",
        error: error.message,
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