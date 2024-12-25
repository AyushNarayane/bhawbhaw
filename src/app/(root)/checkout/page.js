'use client';
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "@/redux/cartSlice";
import { ClipLoader } from "react-spinners";
import { loadAddresses } from "@/redux/addressesSlice"; // import action to load saved addresses

const CheckoutPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const cartItems = useSelector((state) => state.cart.items);
  const subtotal = useSelector((state) => state.cart.subtotal);
  const total = useSelector((state) => state.cart.total);
  const savedAddresses = useSelector((state) => state.addresses.savedAddresses); // Select saved addresses from Redux
  const [deliveryFee] = useState(15);
  const [formData, setFormData] = useState({
    email: user.email || "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    state: "",
    city: "",
    postalCode: "",
    checked: false,
  });
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load saved addresses on component mount
  useEffect(() => {
    dispatch(loadAddresses(savedAddresses)); // Load saved addresses on component mount
    }, [dispatch, savedAddresses]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleContinueShipping = (e) => {
    e.preventDefault();
    const { email, firstName, lastName, address, state, city, postalCode } = formData;
    if (!email || !firstName || !lastName || !address || !state || !city || !postalCode) {
      setError("All fields are required.");
      return;
    }
    setError(null);
  };

  const handleProceedToPayment = async () => {
    const orderData = {
      userId: user.userId,
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
      },
      email: formData.email,
      notification: formData.checked,
      totalAmount: total + deliveryFee, // Add delivery fee to total amount
    };

    try {
      setLoading(true);
      const response = await fetch(`/api/checkout/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        dispatch(clearCart()); // Clear cart after successful order
        setIsPopupVisible(true);
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

  const closePopup = () => {
    setIsPopupVisible(false);
    router.push('/products'); // Redirect to products page after order is placed
  };

  return (
    <div className="font-poppins py-6 text-black bg-white">
      <style jsx>{`
        input::placeholder {
          color: #c1c8e1;
        }
      `}</style>
      <div className="bg-[#e4d5d0] py-8 lg:py-16 px-10 lg:px-36 mb-6">
        <h1 className="text-lg lg:text-xl font-bold text-left text-[#15245E]">Hello {user.userData.username} !!</h1>
      </div>
      <div className="flex flex-col lg:flex-row lg:justify-between mx-auto lg:mx-16 gap-6 lg:gap-0">
        <div className="w-full lg:w-8/12">
          <h2 className="text-lg lg:text-xl text-[#1D3178] font-extrabold mb-4 lg:m-4">Checkout</h2>
          <div className="shadow-lg bg-[#fdfafa]">
            <div className="p-6 rounded-lg mb-6">
              <div className="flex flex-col lg:flex-row justify-between items-center mb-4">
                <h3 className="text-lg lg:text-xl text-[#1D3178] font-extrabold my-4">Contact Information</h3>
                <span className="text-sm text-[#676767]">Already have an account? <a href="#">Log in</a></span>
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email or mobile phone number"
                className="w-full py-3 my-4 text-sm focus:outline-none bg-[#fdfafa] border-b-2 border-gray-300"
                value={formData.email}
                onChange={handleChange}
              />
              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  name="checked"
                  className="mr-2"
                  checked={formData.checked}
                  onChange={handleChange}
                />
                <span className="text-sm text-[#676767]">Keep me up to date on news and exclusive offers</span>
              </div>
            </div>
            <div className="p-6 rounded-lg">
              <div className="flex items-center justify-between my-4">
                <h3 className="text-lg lg:text-xl text-[#1D3178] font-extrabold">Shipping address</h3>
                <div className="flex justify-end">
                  <Link href="/saved-addresses">
                    <button className="bg-[#E57A7A] text-white mt-10 lg:mt-28 mb-10 px-6 py-3 rounded-md font-semibold w-full lg:w-auto">
                      Saved Addresses
                    </button>
                  </Link>
                </div>
              </div>

              {savedAddresses.length > 0 ? (
                savedAddresses.map((address, index) => (
                  <div key={index}>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, ...address })}
                      className="w-full py-3 text-sm mb-7 focus:outline-none bg-[#fdfafa] border-b-2 border-gray-300"
                    >
                      {address.firstName} {address.lastName}, {address.city}
                    </button>
                  </div>
                ))
              ) : (
                <p>No saved addresses available</p>
              )}

              {["firstName", "lastName", "address", "apartment", "state", "city", "postalCode"].map((field) => (
                <input
                  key={field}
                  type="text"
                  name={field}
                  placeholder={field === "firstName" ? "First name (optional)" : field.charAt(0).toUpperCase() + field.slice(1)}
                  className="w-full py-3 text-sm mb-7 focus:outline-none bg-[#fdfafa] border-b-2 border-gray-300"
                  value={formData[field]}
                  onChange={handleChange}
                />
              ))}

              <button
                className="bg-[#E57A7A] text-white mt-10 lg:mt-28 mb-10 px-6 py-3 rounded-md font-semibold w-full lg:w-auto"
                onClick={handleContinueShipping}
              >
                Continue Shipping
              </button>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-4/12">
          <div className="rounded-lg">
            <div className="mb-6 py-6 ml-5">
              {cartItems.map((item, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-center">
                    <img src={item.images} alt={item.title} className="w-16 h-12 lg:w-20 mx-2 lg:h-16 object-cover rounded-lg" />
                    <div className="flex-1 text-sm lg:text-base">
                      <h3 className="font-semibold text-sm text-black mb-2">{item.title}</h3>
                      <div className="flex justify-between">
                        <p className="text-[#7D7D7D] text-xs">Qty: {item.qty}</p>
                        <p className="text-[#1D3178] text-sm">₹ {item.price}</p>
                      </div>
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
              <p className="font-semibold text-lg">₹ {total + deliveryFee}</p>
            </div>
            {error && <div className="text-red-600 text-sm mx-5">{error}</div>}
            <button
                className="w-full text-white font-semibold bg-[#E57A7A] py-4 rounded-md mt-5"
                onClick={handleProceedToPayment}
              >
                {loading ? <ClipLoader color="#fff" loading={loading} size={24} /> : "Proceed to Payment"}
              </button>
              <Link href="/my-orders">
              <button
                className="w-full text-white font-semibold bg-[#E57A7A] py-4 rounded-md mt-5"
                
              >
                 View My Orders
              </button>
              </Link>
          </div>
        </div>
      </div>

      {isPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg relative">
          <button
            className="absolute top-2 right-2"
            onClick={closePopup}
            aria-label="Close popup"
          >
            <img
              src="/images/services/cross.png"
              alt="Close"
              className="w-4 h-4 m-1"
            />
          </button>
          <div className="flex flex-col mx-32 my-3 items-center">
            <img
              src="/images/services/popup.png"
              alt="Success Icon"
              className="w-32 h-32 mb-7"
            />
            <h3 className="text-lg font-semibold mb-2">Order successful!</h3>
            
            <button className="mt-4 bg-[#E57A7A] text-white px-4 py-2 rounded" onClick={closePopup}>Close</button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default CheckoutPage;
