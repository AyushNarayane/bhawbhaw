"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../redux/cartSlice";
import { addToWishlist, removeFromWishlist } from "../redux/wishlistSlice";
import toast from 'react-hot-toast';

const ProductCard = ({ product, isRecommendation = false }) => {
  const router = useRouter();
  const user = useSelector(state => state.user.userId);
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  const wishlistItems = useSelector(state => state.wishlist.items);

  const [isProductInCart, setIsProductInCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    setIsProductInCart(cartItems.some(item => item.id === product.id));
    setIsInWishlist(wishlistItems.some(item => item.id === product.id));
  }, [cartItems, wishlistItems, product.id]);


  const handleCartAction = () => {
    if (!user) {
      toast.error("Please log in to add products to your cart.");
      return;
    }
  
    if (isProductInCart) {
      dispatch(removeFromCart(product));
      toast.success("Product removed from cart");
    } else {
      dispatch(addToCart(product));
      toast.success("Product added to cart");
    }
  };
  
  const handleWishlistAction = () => {
    if (!user) {
      toast.error("Please log in to manage your wishlist.");
      return;
    }
  
    if (isInWishlist) {
      dispatch(removeFromWishlist(product));
      toast.success("Product removed from wishlist");
    } else {
      dispatch(addToWishlist(product));
      toast.success("Product added to wishlist");
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

  const handleCompare = () => {
    const compareList = JSON.parse(localStorage.getItem('compareList') || '[]');
    if (!compareList.some(item => item.id === product.id)) {
      compareList.push(product);
      localStorage.setItem('compareList', JSON.stringify(compareList));
      toast.success("Product added to compare list");
    } else {
      toast.error("Product already in compare list");
    }
  };

  return (
    <div className="relative rounded font-montserrat overflow-hidden p-4 group shadow-lg bg-white">
      <div className="absolute top-4 right-4 p-2 rounded-full bg-black shadow-md hover:bg-gray-200 focus:outline-none">
        <img
          src="/images/common/heart.png"
          alt="wishlist"
          className={`w-4 h-4 cursor-pointer ${isInWishlist ? 'opacity-50' : ''}`}
          onClick={handleWishlistAction}
        />
      </div>

      <div className="bg-[#F3EAE7] mx-3 py-3 rounded-lg mt-10">
        <img
          className="w-full h-48 object-contain"
          src={product.images}
          alt={product.title}
        />
      </div>

      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={handleCartAction}
          className="border border-white text-white font-bold py-2 px-4 rounded mb-4"
        >
          {isProductInCart ? 'Remove from Cart' : 'Add to Cart'}
        </button>
        <div className="flex space-x-6">
          <button onClick={handleShare} className="text-white text-sm">Share</button>
          <button onClick={handleCompare} className="text-white text-sm">Compare</button>
          <button onClick={handleWishlistAction} className="text-white text-sm">
            {isInWishlist ? 'Unlike' : 'Like'}
          </button>
        </div>
      </div>

      <div className="py-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-black text-sm text-[#2C2C2C]">{product.title}</h3>
          <span className="text-sm font-semibold text-gray-800">
            ₹{product.sellingPrice}
          </span>
        </div>

        <p className="text-gray-700 my-5 text-xs w-64">{product.description}</p>

        <div className="flex items-center">
          {Array.from({ length: Math.floor(product.rating || 4) }, (_, index) => (
            <img
              key={index}
              src="/images/common/star.png"
              alt="star"
              className="w-5 h-5"
            />
          ))}
          <span className="text-gray-600 text-xs ml-4">({product.reviews || 8})</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
