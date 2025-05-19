import { NextResponse } from "next/server";
import { getOrderStatus } from "../borzoClient";

/**
 * API route handler to track delivery order using Borzo API
 * GET /api/delivery/borzo/track?orderId=123456
 */
export async function GET(request) {
  try {
    // Get order ID from URL parameters
    const url = new URL(request.url);
    const orderId = url.searchParams.get("orderId");
    
    // Check if order ID is provided
    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          message: "Order ID is required",
        },
        { status: 400 }
      );
    }

    // Get order status from Borzo API
    const statusResult = await getOrderStatus(orderId);
    
    // Return the order status
    return NextResponse.json({
      success: true,
      orderStatus: {
        orderId: statusResult.order.order_id,
        status: statusResult.order.status,
        statusDescription: statusResult.order.status_description,
        courier: statusResult.order.courier,
        trackingUrls: statusResult.order.points.map(point => point.tracking_url).filter(Boolean),
        points: statusResult.order.points.map(point => ({
          address: point.address,
          status: point.delivery?.status || "pending",
          estimatedArrival: point.estimated_arrival_datetime,
          contactPerson: point.contact_person.name,
          trackingUrl: point.tracking_url
        }))
      }
    });
  } catch (error) {
    console.error("Error tracking Borzo delivery order:", error);
    
    // Return error response
    return NextResponse.json(
      {
        success: false,
        message: "Failed to track delivery order",
        error: error.message
      },
      { status: 500 }
    );
  }
} 