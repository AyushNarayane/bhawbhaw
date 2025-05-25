import { NextResponse } from "next/server";
import { doc, setDoc, serverTimestamp, collection, getDocs, query, where } from "firebase/firestore";
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
    
    // Generate a unique order ID with format "OID" followed by timestamp
    const orderId = `OID${Date.now()}`;
    
    // Use the transaction ID if provided (for multi-vendor orders)
    // or generate a new one with format "TRX" followed by date
    const transactionId = orderData.transactionId || `TRX${Date.now()}`;
    
    // Check if this is a Borzo delivery
    const isBorzoDelivery = orderData.deliveryMethod === 'borzo';
    
    // Borzo order details (if applicable)
    let borzoOrderDetails = [];
    
    // Store the multi-vendor flag if provided
    const isMultiVendor = orderData.isMultiVendor || false;
    
    // If Borzo delivery is selected, create a Borzo delivery order
    if (isBorzoDelivery) {
      try {
        // Add orderId to the orderData
        orderData.orderId = orderId;
        
        // Format the order data for Borzo API
        const borzoOrderData = formatOrderDataForBorzo(orderData);
        
        // Log Borzo request data
        console.log('🚚 Borzo API Request:', {
          timestamp: new Date().toISOString(),
          orderId: orderId,
          isMultiVendor: orderData.isMultiVendor,
          requestData: borzoOrderData
        });
        
        // Handle multiple vendors
        if (orderData.isMultiVendor && Array.isArray(borzoOrderData)) {
          // Create Borzo orders for each vendor
          for (const vendorBorzoData of borzoOrderData) {
            const borzoResponse = await createDeliveryOrder(vendorBorzoData);
            
            // Log individual vendor Borzo response
            console.log('🚚 Borzo API Response for vendor:', {
              timestamp: new Date().toISOString(),
              orderId: orderId,
              vendorId: vendorBorzoData.points[0].client_order_id.split('-')[1],
              responseData: borzoResponse
            });
            
            if (borzoResponse.is_successful) {
              borzoOrderDetails.push({
                vendorId: vendorBorzoData.points[0].client_order_id.split('-')[1],
                orderId: borzoResponse.order.order_id,
                orderName: borzoResponse.order.order_name,
                status: borzoResponse.order.status,
                statusDescription: borzoResponse.order.status_description,
                paymentAmount: borzoResponse.order.payment_amount,
                trackingUrls: borzoResponse.order.points.map(point => point.tracking_url).filter(Boolean)
              });
            }
          }
        } else {
          // Single vendor order
          const borzoResponse = await createDeliveryOrder(borzoOrderData);
          
          // Log Borzo response
          console.log('🚚 Borzo API Response:', {
            timestamp: new Date().toISOString(),
            orderId: orderId,
            responseData: borzoResponse
          });
          
          if (borzoResponse.is_successful) {
            borzoOrderDetails = [{
              vendorId: borzoOrderData.points[0].client_order_id.split('-')[1],
              orderId: borzoResponse.order.order_id,
              orderName: borzoResponse.order.order_name,
              status: borzoResponse.order.status,
              statusDescription: borzoResponse.order.status_description,
              paymentAmount: borzoResponse.order.payment_amount,
              trackingUrls: borzoResponse.order.points.map(point => point.tracking_url).filter(Boolean)
            }];
          }
        }
        
        // If no successful Borzo orders were created
        if (borzoOrderDetails.length === 0) {
          console.error("All Borzo order creation attempts failed, falling back to standard delivery");
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
      transactionId: transactionId,
      isMultiVendor: isMultiVendor,
      createdAt: serverTimestamp(),
      borzoOrderDetails: borzoOrderDetails.length > 0 ? borzoOrderDetails : null,
    });
    
    // Return the order details
    return NextResponse.json({
      success: true,
      message: "Order placed successfully",
      orderId: orderId,
      transactionId: transactionId,
      isMultiVendor: isMultiVendor,
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

/**
 * API handler to get all orders for a given transaction ID
 * GET /api/checkout/checkout?transactionId=TRX-123456789
 */
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const transactionId = url.searchParams.get('transactionId');
    
    console.log('📦 Fetching orders for transaction:', {
      timestamp: new Date().toISOString(),
      transactionId: transactionId
    });
    
    if (!transactionId) {
      return NextResponse.json(
        {
          success: false,
          message: "Transaction ID is required",
        },
        { status: 400 }
      );
    }
    
    // Query all orders with the given transaction ID
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, where("transactionId", "==", transactionId));
    const querySnapshot = await getDocs(q);
    
    const orders = [];
    querySnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    
    // Log the found orders
    console.log('📦 Found orders:', {
      timestamp: new Date().toISOString(),
      transactionId: transactionId,
      orderCount: orders.length,
      orders: orders.map(order => ({
        orderId: order.orderId,
        borzoDetails: order.borzoOrderDetails ? {
          borzoOrderId: order.borzoOrderDetails.orderId,
          status: order.borzoOrderDetails.status
        } : null
      }))
    });
    
    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders by transaction ID:", error);
    
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while fetching orders",
        error: error.message,
      },
      { status: 500 }
    );
  }
} 