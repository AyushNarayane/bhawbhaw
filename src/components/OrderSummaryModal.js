import React, { useState } from 'react';
import { FaTimes, FaChevronRight, FaChevronDown } from 'react-icons/fa';

const OrderSummaryModal = ({ order, allOrders = [], isMultiVendor = false, onClose }) => {
  const [expandedOrder, setExpandedOrder] = useState(null);
  
  // Use all orders if available, otherwise use the single order
  const orders = isMultiVendor && allOrders.length > 0 ? allOrders : [order];
  
  if (!order) {
    return null;
  }
  
  const totalAmount = isMultiVendor 
    ? orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
    : order.totalAmount;
  
  const toggleOrder = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  return (
    <div className="fixed inset-0 bg-black text-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Order Summary</h2>
          <button onClick={onClose}>
            <FaTimes className="text-gray-500 hover:text-black" size={20} />
          </button>
        </div>

        {/* Show transaction ID if multi-vendor */}
        {isMultiVendor && order.transactionId && (
          <div className="mb-4 p-2 bg-gray-100 rounded">
            <p className="text-sm font-semibold">Transaction ID: {order.transactionId}</p>
            <p className="text-xs text-gray-700">This order contains items from multiple vendors</p>
          </div>
        )}

        {/* Shipping Address (same for all orders in a transaction) */}
        {order.shippingAddress && (
          <div className="mb-4 p-3 border border-gray-200 rounded">
            <h3 className="font-semibold">Shipping Address:</h3>
            <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
            <p>{order.shippingAddress.address}, {order.shippingAddress.apartment}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}</p>
            <p>{order.email}</p>
          </div>
        )}

        {/* Order Items - Show by vendor if multiple */}
        {isMultiVendor ? (
          <div className="space-y-4">
            <h3 className="font-semibold">Orders:</h3>
            
            {orders.map((vendorOrder, index) => (
              <div key={vendorOrder.orderId || index} className="border border-gray-200 rounded">
                <div 
                  className="flex justify-between items-center p-3 cursor-pointer bg-gray-50 hover:bg-gray-100"
                  onClick={() => toggleOrder(vendorOrder.orderId)}
                >
                  <div>
                    <p className="font-semibold">
                      {vendorOrder.storeInfo?.contactName || `Vendor #${index + 1}`}
                    </p>
                    <p className="text-xs text-gray-600">Order ID: {vendorOrder.orderId}</p>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">{vendorOrder.totalAmount} INR</span>
                    {expandedOrder === vendorOrder.orderId ? <FaChevronDown /> : <FaChevronRight />}
                  </div>
                </div>
                
                {expandedOrder === vendorOrder.orderId && (
                  <div className="p-3 border-t border-gray-200">
                    <h4 className="font-medium mb-2">Items:</h4>
                    <ul className="space-y-2">
                      {vendorOrder.cartItems && vendorOrder.cartItems.map((item, idx) => (
                        <li key={idx} className="flex justify-between">
                          <span className="flex-1">{item.title} (x{item.quantity})</span>
                          <span>{item.sellingPrice} INR</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="mt-3 pt-2 border-t border-gray-100">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>{vendorOrder.totalAmount - vendorOrder.deliveryFee} INR</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery Fee:</span>
                        <span>{vendorOrder.deliveryFee} INR</span>
                      </div>
                      <div className="flex justify-between font-semibold mt-2">
                        <span>Total:</span>
                        <span>{vendorOrder.totalAmount} INR</span>
                      </div>
                    </div>
                    
                    {vendorOrder.borzoOrderDetails && (
                      <div className="mt-3 p-2 bg-blue-50 rounded text-sm">
                        <p className="font-medium">Delivery Tracking:</p>
                        {vendorOrder.borzoOrderDetails.trackingUrls && vendorOrder.borzoOrderDetails.trackingUrls.map((url, i) => (
                          <a 
                            key={i} 
                            href={url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline block mt-1"
                          >
                            Track Package {i+1}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          // Single vendor order display
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Items:</h3>
              <ul className="space-y-2">
                {order.cartItems && order.cartItems.map((item, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{item.title} (x{item.quantity})</span>
                    <span>{item.sellingPrice} INR</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{order.totalAmount - order.deliveryFee} INR</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee:</span>
                <span>{order.deliveryFee} INR</span>
              </div>
              <div className="flex justify-between font-semibold mt-2">
                <span>Total Amount:</span>
                <span>{order.totalAmount} INR</span>
              </div>
            </div>

            <div className="mt-4">
              <span className="font-semibold">Payment Method:</span>
              <p>{order.paymentMethod}</p>
            </div>

            {/* Borzo tracking info if available */}
            {order.borzoOrderDetails && (
              <div className="mt-3 p-3 bg-blue-50 rounded">
                <p className="font-medium">Delivery Tracking:</p>
                {order.borzoOrderDetails.trackingUrls && order.borzoOrderDetails.trackingUrls.map((url, i) => (
                  <a 
                    key={i} 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline block mt-1"
                  >
                    Track Package {i+1}
                  </a>
                ))}
              </div>
            )}

            {/* Dispatch Days */}
            {order.dispatchDays && (
              <div className="mt-4">
                <span className="font-semibold">Expected Dispatch:</span>
                <p>{order.dispatchDays} days</p>
              </div>
            )}
          </div>
        )}

        {/* Total for multi-vendor */}
        {isMultiVendor && (
          <div className="mt-6 p-3 bg-gray-100 rounded">
            <div className="flex justify-between font-bold">
              <span>Total Amount (All Orders):</span>
              <span>{totalAmount} INR</span>
            </div>
            <div className="mt-2">
              <span className="font-semibold">Payment Method:</span>
              <p>{order.paymentMethod}</p>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default OrderSummaryModal;
