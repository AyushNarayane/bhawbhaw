'use client';
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useDispatch } from "react-redux";
import { setTotalVal, setDeliveryFee } from "@/redux/cartSlice";
import { ClipLoader } from "react-spinners";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "firebaseConfig";
import Image from "next/image";
import PaymentOptions from "@/components/PaymentOptions";
import DeliveryOptions from "@/components/DeliveryOptions";

const CheckoutPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [deliveryFee, setDeliveryFeeState] = useState(15);
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState({
    type: 'standard',
    price: 15,
    borzoDetails: null
  });
  const [vendorInfo, setVendorInfo] = useState(null);

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [userId, setUserId] = useState();
  const [name, setName] = useState();
  const [email, setEmail] = useState();

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isloading, setIsloading] = useState(false)
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    email: email,
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    state: "",
    city: "",
    postalCode: "",
    checked: false,
    id:"",
    latitude: null,
    longitude: null,
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser?.userId) {
      setUserId(storedUser.userId);
    } else {
      router.push("/signin");
    }

    if (storedUser?.email) {
      setEmail(storedUser.email);
    }

    if (storedUser?.name) {
      setName(storedUser.name);
    }

    const fetchSavedAddresses = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!storedUser?.userId) {
          router.push("/signin");
          return;
        }

        const userId = storedUser.userId;
        const addressRef = doc(db, "users", userId);
        const userDoc = await getDoc(addressRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setSavedAddresses(data.addresses || []);
          setFormData(data.addresses?.[0] || {});
        } else {
          console.log("No saved addresses found.");
        }

        const storedCart = sessionStorage.getItem('selectedItems'); // Fetch from sessionStorage
        if (storedCart) {
          setCartItems(JSON.parse(storedCart)); 
        }
      } catch (error) {
        console.error("Error fetching saved addresses:", error);
        setError("Failed to load saved addresses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedAddresses();
  }, [router]);

  // Fetch vendor information when cart items are loaded
  useEffect(() => {
    const fetchVendorInfo = async () => {
      if (cartItems.length === 0) return;
      
      try {
        // Get unique vendor IDs from cart items
        const vendorIds = [...new Set(cartItems.map(item => item.vendorID || item.vendorId))].filter(Boolean);
        
        console.log('Vendor IDs found in cart:', vendorIds);
        
        if (vendorIds.length === 0) {
          console.log('No vendor IDs found, using default vendor info');
          // Set default vendor info if no vendor ID is found
          setVendorInfo({
            address: "BhawBhaw Store, Delhi",
            contactName: "BhawBhaw Store",
            contactPhone: "9999999999",
            latitude: 28.6139,
            longitude: 77.2090,
            postalCode: "110001"
          });
          return;
        }
        
        // Handle multiple vendors
        if (vendorIds.length > 1) {
          console.log('Multiple vendors found:', vendorIds);
          
          // Fetch vendor details for all vendors
          const vendorInfoPromises = vendorIds.map(async (vendorId) => {
            try {
              const vendorRef = doc(db, "vendors", vendorId);
              const vendorDoc = await getDoc(vendorRef);
              
              if (vendorDoc.exists()) {
                const vendorData = vendorDoc.data();
                const businessDetails = vendorData.businessDetails || {};
                
                return {
                  id: vendorId,
                  address: businessDetails.pickupAddress || "Default Address",
                  contactName: businessDetails.brandName || "Default Store",
                  contactPhone: businessDetails.contactPhone || "9999999999",
                  latitude: businessDetails.latitude, // Keep as is, ensure this path is correct in Firestore
                  longitude: businessDetails.longitude, // Keep as is, ensure this path is correct in Firestore
                  postalCode: businessDetails.pincode || "110070"
                };
              } else {
                console.log('Vendor not found in database:', vendorId);
                return {
                  id: vendorId,
                  address: "BhawBhaw Store, Delhi",
                  contactName: "BhawBhaw Store",
                  contactPhone: "9999999999",
                  latitude: 28.6139, // Default fallback
                  longitude: 77.2090, // Default fallback
                  postalCode: "110001"
                };
              }
            } catch (error) {
              console.error("Error fetching vendor info for:", vendorId, error);
              return {
                id: vendorId,
                address: "BhawBhaw Store, Delhi", // Default fallback on error
                contactName: "BhawBhaw Store",
                contactPhone: "9999999999",
                latitude: 28.6139,
                longitude: 77.2090,
                postalCode: "110001"
              };
            }
          });
          
          const vendorInfoArray = await Promise.all(vendorInfoPromises);
          
          // Store vendorInfo as an object keyed by vendor ID
          const vendorInfoObject = vendorInfoArray.reduce((acc, currentVendor) => {
            if (currentVendor && currentVendor.id) {
              acc[currentVendor.id] = currentVendor;
            }
            return acc;
          }, {});
          
          setVendorInfo(vendorInfoObject);
          console.log("Updated vendorInfo (object for multiple vendors):", vendorInfoObject);
          return;
        }
        
        // Single vendor case - keep existing behavior
        const vendorId = vendorIds[0];
        console.log('Using vendor ID:', vendorId);
        
        // Fetch vendor details from Firestore
        const vendorRef = doc(db, "vendors", vendorId);
        const vendorDoc = await getDoc(vendorRef);
        
        if (vendorDoc.exists()) {
          const vendorData = vendorDoc.data();
          const businessDetails = vendorData.businessDetails || {};
          
          console.log('Vendor data fetched:', {
            vendorId,
            businessDetails,
            fullVendorData: vendorData
          });
          
          setVendorInfo({
            id: vendorId,
            address: businessDetails.pickupAddress || "Default Address",
            contactName: businessDetails.brandName || "Default Store",
            contactPhone: businessDetails.contactPhone || "9999999999",
            latitude: businessDetails.latitude || 28.6139,
            longitude: businessDetails.longitude || 77.2090,
            postalCode: businessDetails.pincode || "110070"
          });
        } else {
          console.log('Vendor not found in database:', vendorId);
          // Set default vendor info if vendor is not found
          setVendorInfo({
            id: vendorId,
            address: "BhawBhaw Store, Delhi",
            contactName: "BhawBhaw Store",
            contactPhone: "9999999999",
            latitude: 28.6139,
            longitude: 77.2090,
            postalCode: "110001"
          });
        }
      } catch (error) {
        console.error("Error fetching vendor info:", error);
        // Set default vendor info on error
        setVendorInfo({
          address: "BhawBhaw Store, Delhi",
          contactName: "BhawBhaw Store",
          contactPhone: "9999999999",
          latitude: 28.6139,
          longitude: 77.2090,
          postalCode: "110001"
        });
      }
    };

    fetchVendorInfo();
  }, [cartItems]);

  useEffect(() => {
    if (cartItems.length !== 0) {
      let subTotal = 0;
      for (let item of cartItems) {
        subTotal += item.sellingPrice * item.quantity;
      }
      setSubtotal(subTotal);
      setTotal(subTotal + selectedDeliveryOption.price); // Add delivery fee to total amount
    }
  }, [cartItems, selectedDeliveryOption.price]);

  const handleProceedToPayment = async () => {
    setLoading(true);
    
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      setError("User details not found");
      setLoading(false);
      return;
    }

    const userDetails = userDoc.data();

    // Group cart items by vendor
    const itemsByVendor = {};
    
    cartItems.forEach(item => {
      const vendorId = item.vendorID || item.vendorId;
      if (!vendorId) return;
      
      if (!itemsByVendor[vendorId]) {
        itemsByVendor[vendorId] = [];
      }
      
      itemsByVendor[vendorId].push(item);
    });
    
    // Generate a shared transaction ID for all orders
    const transactionId = `TRX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Create an order for each vendor
    const orderDataArray = [];
    
    // Check if we have multiple vendors
    const isMultiVendor = Array.isArray(vendorInfo);
    
    if (isMultiVendor) {
      // Multiple vendors case
      Object.keys(itemsByVendor).forEach(vendorId => {
        const vendorItems = itemsByVendor[vendorId];
        const vendorData = vendorInfo.find(v => v.id === vendorId) || {
          id: vendorId,
          address: "BhawBhaw Store, Delhi",
          contactName: "BhawBhaw Store", 
          contactPhone: "9999999999",
          latitude: 28.6139,
          longitude: 77.2090,
          postalCode: "110001"
        };
        
        // Calculate subtotal for this vendor
        let vendorSubtotal = 0;
        vendorItems.forEach(item => {
          vendorSubtotal += item.sellingPrice * item.quantity;
        });
        
        // Each vendor gets its own delivery fee
        const vendorTotal = vendorSubtotal + selectedDeliveryOption.price;
        
        orderDataArray.push({
          userId,
          userDetails,
          cartItems: vendorItems,
          paymentMethod: 'COD',
          shippingAddress: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            apartment: formData.apartment,
            state: formData.state,
            city: formData.city,
            postalCode: formData.postalCode,
            id: formData.id,
          },
          email,
          notification: formData.checked,
          totalAmount: vendorTotal,
          deliveryMethod: selectedDeliveryOption.type,
          deliveryFee: selectedDeliveryOption.price,
          borzoDetails: selectedDeliveryOption.borzoDetails,
          storeInfo: vendorData,
          deliveryCoordinates: {
            latitude: formData.latitude || null,
            longitude: formData.longitude || null
          },
          transactionId: transactionId, // Common transaction ID for all orders
          isMultiVendor: true
        });
      });
    } else {
      // Single vendor case - keep existing behavior
    const storeInfo = vendorInfo || {
      address: "BhawBhaw Store, Delhi",
      contactName: "BhawBhaw Store",
      contactPhone: "9999999999",
      latitude: 28.6139,
      longitude: 77.2090,
      postalCode: "110001"
    };

      orderDataArray.push({
      userId,
      userDetails,
      cartItems: cartItems,
      paymentMethod: 'COD',
      shippingAddress: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        apartment: formData.apartment,
        state: formData.state,
        city: formData.city,
        postalCode: formData.postalCode,
        id: formData.id,
      },
      email,
      notification: formData.checked,
      totalAmount: total,
      deliveryMethod: selectedDeliveryOption.type,
      deliveryFee: selectedDeliveryOption.price,
      borzoDetails: selectedDeliveryOption.borzoDetails,
      storeInfo: storeInfo,
      deliveryCoordinates: {
        latitude: formData.latitude || null,
        longitude: formData.longitude || null
        },
        transactionId: transactionId,
        isMultiVendor: false
      });
      }

    try {
      // Process all orders
      const responses = await Promise.all(
        orderDataArray.map(orderData => 
          fetch(`/api/checkout/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
          })
        )
      );
      
      // Check if all requests were successful
      const allSuccessful = responses.every(response => response.ok);
      
      if (allSuccessful) {
        // Get the order IDs
        const responseData = await Promise.all(
          responses.map(response => response.json())
        );
        
        // Use the first order ID for redirection
        // (frontend will fetch all orders related to the transaction)
        const firstOrderId = responseData[0].orderId;
        
        dispatch(setTotalVal(total));
        dispatch(setDeliveryFee(deliveryFee));
        
        // Include transaction ID in the redirect to allow fetching all related orders
        router.push(`/payment-gateway?orderId=${firstOrderId}&transactionId=${transactionId}`);
      } else {
        setError("Failed to process payment for some orders");
      }
    } catch (err) {
      console.error("Error processing payment:", err);
      setError("Failed to process payment");
    } finally {
      setLoading(false);
    }
  };

  const handleAddressClick = (address, index) => {
    setSelectedAddressIndex(index);
    setFormData({ ...address, email });
    console.log('Selected address data:', { address, index, email });
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      address: "",
      apartment: "",
      state: "",
      city: "",
      postalCode: "",
      checked: false,
      id:"",
      latitude: null,
      longitude: null,
    });
    setIsPopupVisible(true);
  };

  const handleAddNewAddress = () => {
    resetForm()
    setIsPopupVisible(true);
  };

  const handleSaveAddress = async () => {
    try {
      setIsloading(true);
      console.log('Saving address with form data:', formData);

      // Validate form data
      const requiredFields = ['firstName', 'lastName', 'address', 'state', 'city', 'postalCode'];
      const validationErrors = [];

      // Check for empty or invalid fields
      requiredFields.forEach(field => {
        const value = formData[field]?.trim();
        if (!value || value === '.' || value.length < 2) {
          validationErrors.push(`${field.charAt(0).toUpperCase() + field.slice(1)} is required and must be valid`);
        }
      });

      // Validate postal code (should be numeric and 6 digits for Indian postal codes)
      if (!/^\d{6}$/.test(formData.postalCode)) {
        validationErrors.push('Postal code must be 6 digits');
      }

      if (validationErrors.length > 0) {
        setError(validationErrors.join(', '));
        setIsloading(false);
        return;
      }

      if (!userId) {
        console.error("User ID is undefined.");
        return;
      }

      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      // Generate the new address with a timestamp
      const newAddress = {
        ...formData,
        id: crypto.randomUUID(),
        createdAt: Timestamp.now()
      };

      console.log('New address to be saved:', newAddress);

      let updatedAddresses = [];

      if (userDoc.exists()) {
        updatedAddresses = [...(userDoc.data().addresses || []), newAddress];
      } else {
        updatedAddresses = [newAddress];
      }

      console.log('Updated addresses list:', updatedAddresses);

      // Update the Firestore document
      await setDoc(userRef, {
        ...userDoc.data(),
        addresses: updatedAddresses
      });

      setSavedAddresses(updatedAddresses);
      console.log('Address saved successfully');

      resetForm();
    } catch (error) {
      console.error("Error adding address:", error);
    } finally {
      setIsloading(false);
      setIsPopupVisible(false)
    }
  };

  const closePopup = () => {
    setIsPopupVisible(false);
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          console.log("Location obtained:", position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to get your location. Please check your browser permissions.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="font-poppins py-6 text-black bg-white p-2">
      <div className="bg-[#e4d5d0] py-8 lg:py-16 px-10 lg:px-20 mb-6 mx-2">
        <h1 className="text-lg lg:text-xl font-bold text-left text-[#15245E]">Hello {name}!!</h1>
      </div>
      <div className="flex flex-col lg:flex-row lg:justify-between mx-auto lg:mx-16 gap-6 lg:gap-0">
        <div className="w-full lg:w-8/12">
          <h2 className="text-lg lg:text-xl text-[#1D3178] font-extrabold mb-4 m-4">Checkout</h2>
          <div className="shadow-lg bg-[#fdfafa]">
            <div className="p-6 rounded-lg">
              <div className="flex items-center justify-between my-4">
                <h3 className="text-lg lg:text-xl text-[#1D3178] font-extrabold">Shipping address</h3>
                <button
                  className="bg-red-500 font-normal px-4 py-2 rounded-xl text-white"
                  onClick={handleAddNewAddress}
                >+ New Address</button>
              </div>

              {savedAddresses.length > 0 ? (
                savedAddresses.map((address, index) => (
                  <div key={index} className="mb-4">
                    <button
                      type="button"
                      onClick={() => handleAddressClick(address, index)}
                      className={`w-full p-4 rounded-lg shadow-md border transition-all duration-300 ${selectedAddressIndex === index ? 'bg-red-100' : 'bg-white'} hover:shadow-lg focus:outline-none`}
                    >
                      <div className="flex flex-col items-start">
                        <div className="flex justify-between w-full mb-2">
                          <h3 className="text-lg font-semibold text-[#4D413E]">
                            {address.firstName} {address.lastName}
                          </h3>
                          <span className="text-sm text-gray-500">{address.city}</span>
                        </div>
                        <p className="text-sm text-gray-700">{address.address}</p>
                        <p className="text-sm text-gray-700">{address.apartment}</p>
                        <p className="text-sm text-gray-700">
                          {address.state}, {address.postalCode}
                        </p>
                      </div>
                    </button>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center gap-4 w-fit border border-gray-200 rounded-lg p-6 my-6 bg-gray-200 shadow-lg">
                  <p className="text-gray-500 font-medium text-lg">No saved addresses available</p>
                  <Link
                    href="/saved-addresses"
                    className="bg-red-500 text-white px-4 py-2 rounded-xl shadow hover:bg-red-600"
                  >
                    Add a Saved Address
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="w-full lg:w-4/12">
          <div className="rounded-lg">
            <div className="mb-6 py-6 ml-5">
              {cartItems.map((item, index) => (
                <div key={index} className="mb-6 p-4 bg-white rounded-lg shadow-lg flex items-center space-x-4">
                  <Image
                    height={100}
                    width={100}
                    src={item.images[0]}
                    alt={item.title}
                    className="size20 lg:size-24 object-fill rounded-lg shadow-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">{item.title}</h3>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <p className="text-[#7D7D7D] text-sm">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-[#1D3178] text-lg font-semibold">₹ {item.sellingPrice}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center my-4 mx-5">
              <p className="text-[#757575]">Subtotal:</p>
              <p>₹ {subtotal}</p>
            </div>
            <div className="mx-5">
              <DeliveryOptions 
                shippingAddress={formData}
                storeInfo={vendorInfo || {
                  address: "BhawBhaw Store, Delhi",
                  contactName: "BhawBhaw Store",
                  contactPhone: "9999999999",
                  latitude: 28.6139, // Default coordinates for Delhi
                  longitude: 77.2090,
                  postalCode: formData.postalCode,
                }}
                onSelectDeliveryOption={(option) => {
                  setSelectedDeliveryOption(option);
                  setDeliveryFeeState(option.price);
                }}
                initialDeliveryFee={deliveryFee}
              />
            </div>
            <div className="flex justify-between items-center my-4 mx-5">
              <p className="text-[#757575]">Shipping Fee:</p>
              <p>₹ {selectedDeliveryOption.price}</p>
            </div>
            <div className="flex justify-between items-center my-4 mx-5">
              <p className="text-[#757575]">Total:</p>
              <p className="font-semibold text-lg">₹ {total}</p>
            </div>
            {error && <div className="text-red-600 text-sm mx-5">{error}</div>}
            <button
              className="w-full text-white font-semibold bg-[#E57A7A] py-4 rounded-md mt-5"
              onClick={handleProceedToPayment}
            >
              {loading ? <ClipLoader color="#fff" loading={loading} size={24} /> : "Proceed to Payment"}
            </button>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      {isPopupVisible && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">
              Add Address
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveAddress();
              }}
              className="space-y-4"
            >
              {["firstName", "lastName", "address", "apartment", "state", "city", "postalCode"].map(
                (field) => (
                  <div key={field} className="flex flex-col">
                    <input
                      type="text"
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                      value={formData[field]}
                      onChange={(e) =>
                        setFormData({ ...formData, [field]: e.target.value })
                      }
                      className="w-full px-4 py-3 border rounded-md outline-none text-black"
                      minLength={2}
                      required
                      pattern={field === 'postalCode' ? '\\d{6}' : '[A-Za-z0-9\\s\\-\\.,]+'}
                      title={field === 'postalCode' ? 'Please enter a valid 6-digit postal code' : 'Please enter a valid text'}
                    />
                    {field === 'postalCode' && (
                      <span className="text-xs text-gray-500 mt-1">Must be 6 digits</span>
                    )}
                  </div>
                )
              )}
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="useCoordinates"
                  checked={formData.useCoordinates}
                  onChange={(e) => {
                    setFormData({ ...formData, useCoordinates: e.target.checked });
                    if (e.target.checked) {
                      getUserLocation();
                    } else {
                      setFormData({
                        ...formData,
                        useCoordinates: false,
                        latitude: null,
                        longitude: null
                      });
                    }
                  }}
                  className="w-4 h-4"
                />
                <label htmlFor="useCoordinates" className="text-sm text-gray-700">
                  For fast delivery, use my current coordinates
                </label>
              </div>
              
              {formData.latitude && formData.longitude && (
                <div className="text-xs text-green-600">
                  Coordinates obtained: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closePopup}
                  className="px-4 py-2 bg-gray-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-500 text-white rounded-xl hover:bg-red-500"
                  disabled={isloading}
                >
                  {isloading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;