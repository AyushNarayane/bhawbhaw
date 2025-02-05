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

const CheckoutPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [deliveryFee] = useState(15);

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

  useEffect(() => {
    if (cartItems.length !== 0) {
      let subTotal = 0;
      for (let item of cartItems) {
        subTotal += item.sellingPrice * item.quantity;
      }
      setSubtotal(subTotal);
      setTotal(subTotal + deliveryFee); // Add delivery fee to total amount
    }
  }, [cartItems, deliveryFee]);

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

    const orderData = {
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
    };
    // console.log(orderData);
    

    try {
      const response = await fetch(`/api/checkout/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const data = await response.json()
        dispatch(setTotalVal(total))
        dispatch(setDeliveryFee(deliveryFee))
        router.push(`/payment-gateway?orderId=${data.orderId}`);
      } else {
        setError("Failed to process payment");
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
        createdAt: Timestamp.now() // ISO string format for consistency
      };

      let updatedAddresses = [];

      if (userDoc.exists()) {
        updatedAddresses = [...(userDoc.data().addresses || []), newAddress];
      } else {
        updatedAddresses = [newAddress];
      }

      // Update the Firestore document
      await setDoc(userRef, {
        ...userDoc.data(),
        addresses: updatedAddresses
      });

      setSavedAddresses(updatedAddresses);
      // console.log(savedAddresses);

      resetForm();
      console.log("Address added successfully.");
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
            <div className="flex justify-between items-center my-4 mx-5">
              <p className="text-[#757575]">Shipping Fee:</p>
              <p>₹ {deliveryFee}</p>
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
                  <input
                    key={field}
                    type="text"
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={formData[field]}
                    onChange={(e) =>
                      setFormData({ ...formData, [field]: e.target.value })
                    }
                    className="w-full px-4 py-3 border rounded-md outline-none text-black"
                  />
                )
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