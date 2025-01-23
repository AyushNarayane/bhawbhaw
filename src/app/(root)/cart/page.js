'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useSelector } from "react-redux";
import { setDiscount } from "@/redux/cartSlice";
import { ClipLoader } from "react-spinners";
import ProtectedHomeRoute from "@/components/ProtectedHomeRoute";
import { db } from "firebaseConfig";
import { collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import Popup from "@/components/Popup";
import CartItem from "@/components/CartItem";
import CouponSection from "@/components/CouponSection";

const Cart = () => {
  const [cartItems, setCartItems] = useState([])
  const [total, setTotal] = useState(0)
  const [subtotal, setSubtotal] = useState(0)
  const user = useSelector(state => state.user.userId)
  // const subtotal = useSelector((state) => state.cart.subtotal);
  // const total = useSelector((state) => state.cart.total);
  // const discountAmount = useSelector((state) => state.cart.discountAmount);
  const [discountAmount, setDiscountAmount] = useState(0)
  const [deliveryFee] = useState(15);

  const [coupon, setCoupon] = useState('');
  const [coupons, setCoupons] = useState([]);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [error, setError] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isPopupVisible1, setIsPopupVisible1] = useState(false);
  const [isPopupVisible2, setIsPopupVisible2] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        if (!user) {
          router.push('/signin')
          return;
        }

        const cartRef = doc(db, 'cart', user)
        const cartDoc = await getDoc(cartRef)

        if (cartDoc.exists()) {
          setCartItems(cartDoc.data().items)
          const allProductIds = cartDoc.data().items.map(item => item.productId);
          setSelectedItems(allProductIds);
        }
      } catch (error) {
        console.log(error)
      }
    }

    const fetchCoupons = async () => {
      try {
        const response = await fetch(`/api/coupons/getAllCoupons`)
        const data = await response.json()

        if (response.ok) {
          setCoupons(data.coupons)
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchCartItems();
    fetchCoupons();
  }, [user]);

  // console.log(coupons);


  useEffect(() => {
    if (cartItems.length !== 0) {
      let subTotal = 0;
      const itemsToCalculate = cartItems.filter(item => selectedItems.includes(item.productId));

      for (let item of itemsToCalculate) {
        subTotal += item.sellingPrice * item.quantity;
      }

      setSubtotal(subTotal);
      setTotal(subTotal + deliveryFee - (subtotal * discountAmount / 100));
    }
  }, [cartItems, selectedItems, discountAmount, deliveryFee]);

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      setIsPopupVisible(true); // Show popup if the cart is empty
      return;
    }

    const selectedItemsForCheckout = cartItems.filter(item => selectedItems.includes(item.productId));

    if (selectedItemsForCheckout.length > 0) {
      sessionStorage.setItem('selectedItems', JSON.stringify(selectedItemsForCheckout));
      router.push('/checkout');
    } else {
      toast.error("Please select items to proceed to checkout.");
    }
  };

  const handleItemSelection = (productId) => {
    if (selectedItems.includes(productId)) {
      setSelectedItems(selectedItems.filter(id => id !== productId));
    } else {
      setSelectedItems([...selectedItems, productId]);
    }
  };

  const handleDelete = async (item) => {
    if (!user) {
      toast.error("Please log in to delete products from your cart.");
      return;
    }

    try {
      const cartRef = doc(db, 'cart', user);
      const cartDoc = await getDoc(cartRef);

      if (cartDoc.exists()) {
        const cartData = cartDoc.data();
        const updatedItems = cartData.items.filter(cartItem => cartItem.productId !== item.productId);

        if (updatedItems.length === cartData.items.length) {
          toast.error("Product not found in the cart.");
          return;
        }

        await setDoc(cartRef, { items: updatedItems }, { merge: true });
        setCartItems(updatedItems);

        toast.success("Product removed from cart");
      }
    } catch (error) {
      console.error("Error removing product from cart:", error);
      toast.error("Failed to remove product from cart");
    }
  }

  const handleQuantityChange = async (id, change) => {
    if (!user) {
      toast.error("Please log in to update product quantity.");
      return;
    }

    try {
      const cartRef = doc(db, 'cart', user)
      const cartDoc = await getDoc(cartRef)
      let ok = true

      if (cartDoc.exists()) {
        const cartData = cartDoc.data()
        const updatedItems = cartData.items.map(item => {
          if (item.productId === id) {
            const updatedQuantity = item.quantity + change;

            if (updatedQuantity < 1) {
              toast.error("Quantity cannot be less than 1");
              ok = false
              return item;
            }

            return { ...item, quantity: updatedQuantity };
          }
          return item;
        });

        if (ok) {
          await setDoc(cartRef, { items: updatedItems }, { merge: true });
          setCartItems(updatedItems);
          toast.success(change > 0 ? "Product quantity increased" : "Product quantity decreased");
        }
      }
    } catch (error) {
      console.error("Error updating cart quantity:", error);
      toast.error("Failed to update product quantity");
    }
  }

  const handleApplyCoupon = async () => {
    if (!coupon) return;

    try {
      setValidatingCoupon(true);
      const response = await fetch(`/api/coupons/getCouponsByTitle?couponTitle=${coupon}`);

      if (!response.ok) {
        if (response.status === 404) {
          setIsPopupVisible1(true);
          // dispatch(setDiscount(0)); // Reset discount if coupon not found
          setDiscount(0)
        } else {
          setError("Error applying coupon");
          toast.error("Error applying coupon");
        }
        return;
      }

      const { coupons } = await response.json();
      const couponData = coupons[0];

      if (subtotal < couponData.minPrice) {
        setIsPopupVisible2(true);
        return;
      }

      setDiscountAmount(couponData.discount)
      setTotal(total - ((subtotal * discountAmount / 100).toFixed(2)))
      // dispatch(setDiscount(couponData.discount));
      setError("Coupon Applied");
    } catch (error) {
      console.error("Error applying coupon:", error);
      setError("An error occurred while applying the coupon.");
    } finally {
      setValidatingCoupon(false);
    }
  };

  const closePopup = () => setIsPopupVisible(false);
  const closePopup1 = () => setIsPopupVisible1(false);
  const closePopup2 = () => setIsPopupVisible2(false);

  return (
    <div className="flex bg-white text-black flex-col px-4 md:px-8 font-poppins">
      <Toaster />
      <div className="flex items-center mt-4 md:mt-8">
        <Link href='/' className="text-sm md:text-lg text-[#676767]">Home</Link>
        <img src="images/services/arrow.png" alt="Arrow" className="mx-2 w-3 h-3 md:w-4 md:h-4" />
        <Link href='/cart' className="text-sm md:text-lg">Cart</Link>
      </div>

      <div className="flex flex-col lg:flex-row justify-between mt-6">
        <div className="w-full lg:w-8/12 p-4 md:p-6 lg:p-10">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Your cart</h2>
          {cartItems.length === 0 && <h2 className="text-gray-400">Your Cart is Empty!</h2>}
          {cartItems.map((item) => (
            <CartItem
              key={item.productId}
              item={item}
              selectedItems={selectedItems}
              handleItemSelection={handleItemSelection}
              handleDelete={handleDelete}
              handleQuantityChange={handleQuantityChange}
            />
          ))}
        </div>

        <div className="w-full lg:w-5/12 mb-10 bg-white h-full p-6 rounded-lg lg:mt-24 shadow-lg border border-gray-300">
          <h2 className="text-lg md:text-xl font-semibold mb-3">Order Summary</h2>
          <div className="mb-4">
            <div className="flex justify-between">
              <span className="text-[#676767] text-sm md:text-lg mb-2">Subtotal</span>
              <span className="font-bold">INR {subtotal}</span>
            </div>
            <div className="flex justify-between text-[#E57A7A]">
              <span className="text-[#676767] text-sm md:text-lg mb-2">Discount (-{discountAmount}%)</span>
              <span className="font-bold">-INR {(subtotal * discountAmount / 100).toFixed(2) || `0`}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#676767] text-sm md:text-lg mb-1">Delivery Fee</span>
              <span className="font-bold">INR 15</span>
            </div>
          </div>
          <hr className="border-t border-gray-300 my-4" />
          <div className="flex justify-between mb-3">
            <span className="text-lg md:text-xl font-semibold">Total</span>
            <span className="font-bold">INR {total}</span>
          </div>

          {/* COUPONS SECTION */}
          <CouponSection
            coupon={coupon}
            setCoupon={setCoupon}
            handleApplyCoupon={handleApplyCoupon}
            showCouponModal={showCouponModal}
            setShowCouponModal={setShowCouponModal}
            validatingCoupon={validatingCoupon}
            coupons={coupons}
            error={error}
          />

          <button
            disabled={cartItems.length === 0}
            className={`w-full bg-red-400 text-white py-3 rounded-full mt-4 ${cartItems.length === 0 ? 'cursor-not-allowed bg-red-300' : 'cursor-pointer'}`}
            onClick={handleProceedToCheckout}
          >
            <p>Proceed to Checkout</p>
          </button>
        </div>
      </div>

      {/* Popups for Empty Cart, Invalid Coupon, and Minimum Subtotal */}
      {isPopupVisible && (
        <Popup
          imageSrc="/images/services/cancel.png"
          title="Your cart is empty!"
          message="Please add items to your cart before proceeding."
          closePopup={closePopup}
        />
      )}

      {isPopupVisible1 && (
        <Popup
          imageSrc="/images/services/cancel.png"
          title="Invalid Coupon!"
          message="The coupon code you entered is not valid."
          closePopup={closePopup1}
        />
      )}

      {isPopupVisible2 && (
        <Popup
          imageSrc="/images/services/cancel.png"
          title="Minimum Subtotal Not Attained!"
          message="To apply this coupon, your subtotal must be a bit higher."
          closePopup={closePopup2}
        />
      )}
    </div>
  );
};

export default ProtectedHomeRoute(Cart);