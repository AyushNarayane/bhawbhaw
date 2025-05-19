import { NextResponse } from "next/server";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../../../firebaseConfig";
import { createDeliveryOrder, formatOrderDataForBorzo } from "../../delivery/borzo/borzoClient";

/**
 * API handler for checkout process
 * POST /api/checkout/checkout
 */
export async function POST(request) {
  try {
    // Parse the order data from the request
    const orderData = await request.json();
    
    // Generate a unique order ID
    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Check if this is a Borzo delivery
    const isBorzoDelivery = orderData.deliveryMethod === 'borzo';
    
    // Borzo order details (if applicable)
    let borzoOrderDetails = null;
    
    // If Borzo delivery is selected, create a Borzo delivery order
    if (isBorzoDelivery) {
      try {
        // Add orderId to the orderData
        orderData.orderId = orderId;
        
        // Format the order data for Borzo API
        const borzoOrderData = formatOrderDataForBorzo(orderData);
        
        // Create Borzo delivery order
        const borzoResponse = await createDeliveryOrder(borzoOrderData);
        
        if (borzoResponse.is_successful) {
          borzoOrderDetails = {
            orderId: borzoResponse.order.order_id,
            orderName: borzoResponse.order.order_name,
            status: borzoResponse.order.status,
            statusDescription: borzoResponse.order.status_description,
            paymentAmount: borzoResponse.order.payment_amount,
            trackingUrls: borzoResponse.order.points.map(point => point.tracking_url).filter(Boolean)
          };
        } else {
          // Fall back to standard delivery if Borzo creation fails
          console.error("Borzo order creation failed, falling back to standard delivery");
          orderData.deliveryMethod = 'standard';
          orderData.deliveryFee = 15; // Default delivery fee
        }
      } catch (error) {
        console.error("Error creating Borzo delivery:", error);
        // Fall back to standard delivery
        orderData.deliveryMethod = 'standard';
        orderData.deliveryFee = 15; // Default delivery fee
      }
    }
    
    // Create the order document in Firestore
    const orderRef = doc(db, "orders", orderId);
    await setDoc(orderRef, {
      ...orderData,
      status: "pending",
      orderId: orderId,
      createdAt: serverTimestamp(),
      borzoOrderDetails: borzoOrderDetails, // Add Borzo order details if available
    });
    
    // Return the order details
    return NextResponse.json({
      success: true,
      message: "Order placed successfully",
      orderId: orderId,
      borzoOrderDetails: borzoOrderDetails
    });
  } catch (error) {
    console.error("Error during checkout:", error);
    
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred during checkout",
        error: error.message,
      },
      { status: 500 }
    );
  }
} 