"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist } from "../redux/wishlistSlice";
import toast from 'react-hot-toast';
import Image from "next/image";
import { db } from "firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { setUser } from "@/redux/userSlice";
import Link from "next/link";
import { ClipLoader } from "react-spinners";

const ProductCard = ({ product, isRecommendation = false }) => {
  // console.log(product);

  const router = useRouter();
  // const user = useSelector(state => state.user.userId);
  const [user, setUserLocal] = useState(null) // userId
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  const wishlistItems = useSelector(state => state.wishlist.items);
  const [isProductInCart, setIsProductInCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [buyLoading, setBuyLoading] = useState(false)
  const [cartLoading, setCartLoading] = useState(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)

  useEffect(() => {
    setIsProductInCart(cartItems.some(item => item.productId === product.productId));
    setIsInWishlist(wishlistItems.some(item => item.productId === product.productId));

    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser?.userId) {
      setUserLocal(storedUser.userId)
      dispatch(
        setUser({
          userData: {
            name: storedUser.name,
            email: storedUser.email,
          },
          userId: storedUser.userId,
        })
      );
    }
  }, [cartItems, wishlistItems, product.productId, product.id]);

  const handleBuyAction = () => {
    // if (!user) {
    //   toast.error("Please log in to buy products.");
    //   return;
    // }

    // sessionStorage.setItem('productId', product.productId);
    setBuyLoading(true)
    router.push(`/cart`)
    setBuyLoading(false)
  }

  const handleCartAction = async () => {
    if (!user) {
      toast.error("Please log in to add products to your cart.");
      return;
    }

    setCartLoading(true)
    try {
      const cartRef = doc(db, 'cart', user);
      const cartDoc = await getDoc(cartRef);

      if (cartDoc.exists()) {
        const cartData = cartDoc.data();
        const existingProduct = cartData.items.find(item => item.productId === product.productId);

        if (existingProduct) {
          // Increment quantity if already in cart
          const updatedItems = cartData.items.map(item =>
            item.productId === product.productId ? { ...item, quantity: item.quantity + 1 } : item
          );
          await setDoc(cartRef, { items: updatedItems }, { merge: true });
          toast.success("Product quantity updated in cart");
        } else {
          // Add new product
          await setDoc(
            cartRef,
            { items: [...cartData.items, { ...product, quantity: 1 }] },
            { merge: true }
          );
          toast.success("Product added to cart");
        }
      } else {
        // First item in cart
        await setDoc(cartRef, { items: [{ ...product, quantity: 1 }] });
        toast.success("Product added to cart");
      }
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error("Failed to add product to cart");
    } finally {
      setCartLoading(false)
    }
  }

  const handleWishlistAction = async () => {
    if (!user) {
      toast.error("Please log in to manage your wishlist.");
      return;
    }

    setWishlistLoading(true);
    try {
      const wishlistRef = doc(db, 'wishlists', user);
      const wishlistDoc = await getDoc(wishlistRef);

      if (wishlistDoc.exists()) {
        const wishlistData = wishlistDoc.data();
        const existingProduct = wishlistData.items.find(item => item.productId === product.productId);

        if (existingProduct) {
          // If product is already in wishlist
          toast.error("Product is already in your wishlist.");
        } else {
          // Add new product to wishlist
          await setDoc(
            wishlistRef,
            { items: [...wishlistData.items, { ...product }] },
            { merge: true }
          );
          toast.success("Product added to wishlist");
        }
      } else {
        // First item in wishlist
        await setDoc(wishlistRef, { items: [{ ...product }] });
        toast.success("Product added to wishlist");
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast.error("Failed to add product to wishlist");
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.title,
          text: product.description,
          url: window.location.href,
        });
      } else {
        const url = window.location.href;
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      toast.error("Error sharing: " + error.message);
      console.error("Error sharing:", error);
    }
  };

  return (
    <div className="relative rounded-lg w-80 font-montserrat overflow-hidden p-4 group shadow-md hover:shadow-lg transition-shadow bg-white">
      {/* heart */}
      <div
        aria-disabled={wishlistLoading}
        className={`absolute top-4 right-4 p-2 rounded-full bg-white shadow-md hover:bg-gray-200 focus:outline-none z-20 ${wishlistLoading ? 'cursor-not-allowed' : ''}`}
      >
        <Image
          height={50}
          width={50}
          src="/images/common/blackheart.png"
          alt="wishlist"
          className={`size-4 cursor-pointer ${isInWishlist ? 'opacity-50' : ''}`}
          onClick={handleWishlistAction}
        />
      </div>

      {/* share */}
      <div className="absolute right-14 p-2 rounded-full bg-white shadow-md hover:bg-gray-200 focus:outline-none z-20">
        <Image
          height={50}
          width={50}
          src="/images/share.png"
          alt="like"
          className="w-4 h-4 cursor-pointer"
          onClick={handleShare}
        />
      </div>

      {/* Product Image */}
      <div className="bg-[#F3EAE7] mx-3 py-3 rounded-lg mt-10">
        <Image
          height={200}
          width={200}
          className="w-full h-48 object-contain"
          src={product.images[0] || '/product-placeholder.webp'}
          alt={product.title}
        />
      </div>

      {/* Product Details */}
      <div className="py-4">
        <div className="flex justify-between items-center mb-2">
          <Link
            href={`/productdetails/${product.productId}`}
            className="font-black text-xl text-[#2C2C2C] hover:underline underline-offset-2 line-clamp-1"
          >
            {product.title}
          </Link>
          <div className="flex flex-col items-end">
            <span className="text-lg font-semibold text-gray-800">
              {product.sellingPrice}
            </span>
            {product.maxRetailPrice && (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-green-500 font-semibold whitespace-nowrap">
                  {Math.round(((product.maxRetailPrice - product.sellingPrice) / product.maxRetailPrice) * 100)}% OFF
                </span>
                <span className="text-xs text-gray-500 line-through">
                  {product.maxRetailPrice}
                </span>
              </div>
            )}
          </div>
        </div>

        <p className="text-gray-700 my-3 text-normal w-64 line-clamp-2">{product.description}</p>

        <div className="flex items-center">
          {Array.from({ length: Math.floor(product.rating || 4) }, (_, index) => (
            <Image
              height={50}
              width={50}
              key={index}
              src="/images/common/star.png"
              alt="star"
              className="w-5 h-5"
            />
          ))}
          <span className="text-gray-600 text-xs ml-4">({product.reviews?.length || 0})</span>
        </div>
      </div>

      <div className="relative flex justify-center gap-5 items-center mt-4 z-20">
        <button
          onClick={handleCartAction}
          disabled={cartLoading}
          className="border bg-baw-light py-2 w-full px-4 rounded-full whitespace-nowrap font-semibold"
        >
          {/* {isProductInCart ? 'Remove from Cart' : 'Add to Cart'} */}
          {cartLoading ? <ClipLoader color="#f47450" loading={cartLoading} size={17} /> : "Add to Cart"}
        </button>
        <button
          onClick={handleBuyAction}
          className="bg-baw-red py-2 w-full px-4 rounded-full whitespace-nowrap font-semibold"
          disabled={buyLoading}
        >
          {buyLoading ? <ClipLoader color="#f47450" loading={buyLoading} size={17} /> : 'Buy Now'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;