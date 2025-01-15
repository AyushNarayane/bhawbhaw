"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc, collection, getDocs, query, where, setDoc, arrayUnion, updateDoc } from "firebase/firestore";
import { db } from "firebaseConfig";
import { AiFillHeart, AiFillStar, AiOutlineHeart } from "react-icons/ai";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { useSelector } from "react-redux";
import ProductCard from "@/components/ProductCard";
import { CiStar } from "react-icons/ci";

const ProductDetailsPage = ({ params }) => {
  const router = useRouter();
  const { productId } = params;

  const user = useSelector((state) => state.user.userId)

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [message, setMessage] = useState('');
  const [review, setReview] = useState({
    title: '',
    message: '',
    stars: 0,
    createdAt: new Date(),
  });

  const productsPerPage = 3; // For pagination
  const totalPages = Math.ceil(relatedProducts.length / productsPerPage);

  useEffect(() => {
    if (!productId) {
      console.error("Product ID is missing.");
      router.push("/");
      return;
    }

    const fetchProductDetails = async () => {
      try {
        const productRef = doc(db, "products", productId);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          const productData = productSnap.data();
          setProduct(productData);
          fetchRelatedProducts(productData.subCategory);
        } else {
          console.error("Product not found.");
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    const fetchRelatedProducts = async (subCategory) => {
      try {
        const q = query(collection(db, "products"), where("subCategory", "==", subCategory));
        const querySnapshot = await getDocs(q);
        const products = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setRelatedProducts(products);
      } catch (error) {
        console.error("Error fetching related products:", error);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleAddToCart = async () => {
    if (product && user) {
      const cartRef = doc(db, 'cart', user);
      const cartDoc = await getDoc(cartRef);

      if (cartDoc.exists()) {
        const cartData = cartDoc.data();
        const existingProduct = cartData.items.find(item => item.productId === productId);

        if (existingProduct) {
          // If the product exists in the cart, update the quantity
          await setDoc(cartRef, {
            items: cartData.items.map(item =>
              item.productId === productId
                ? { ...item, quantity: item.quantity + quantity } // Increase quantity
                : item
            )
          }, { merge: true });
        } else {
          // If the product does not exist in the cart, add it
          await setDoc(cartRef, {
            items: [...cartData.items, { ...product, quantity }] // Add new product with quantity
          }, { merge: true });
        }
      } else {
        // Create a new cart if it doesn't exist
        await setDoc(cartRef, {
          items: [{ ...product, quantity }] // Add new product with quantity
        });
      }

      setMessage(`${product.title} added to cart!`);
      router.push('/cart');
    }
  };

  const handleQuantityChange = async (type) => {
    if (!product || !user) {
      return;
    }

    const cartRef = doc(db, 'cart', user);
    const cartDoc = await getDoc(cartRef);

    if (cartDoc.exists()) {
      const cartData = cartDoc.data();
      const existingProduct = cartData.items.find(item => item.productId === productId);

      if (existingProduct) {
        let updatedQuantity = existingProduct.quantity;

        if (type === 'increment') {
          updatedQuantity += 1;
        } else if (type === 'decrement' && updatedQuantity > 1) {
          updatedQuantity -= 1;
        } else {
          alert('Quantity cannot be less than 1');
          return;
        }

        await setDoc(
          cartRef,
          {
            items: cartData.items.map(item => item.productId === productId
              ? { ...item, quantity: updatedQuantity }
              : item
            )
          },
          { merge: true }
        );

        setQuantity(updatedQuantity)
        setMessage(`${product.title} quantity updated to ${updatedQuantity}`);
      }
    } else {
      alert('Cart does not exist. Please add the product to the cart first.');
    }
  };

  // Function to handle adding to the wishlist
  const handleAddToWishlist = async () => {
    if (product && user?.uid) {
      const wishlistRef = doc(db, 'wishlists', user.uid);
      const wishlistDoc = await getDoc(wishlistRef);

      if (wishlistDoc.exists()) {
        const wishlistData = wishlistDoc.data();
        const existingProduct = wishlistData.items.find(item => item.productId === productId);

        if (!existingProduct) {
          // If the product does not exist in the wishlist, add it
          await setDoc(wishlistRef, {
            items: [...wishlistData.items, product] // Add new product
          }, { merge: true });
          setMessage(`${product.title} added to wishlist!`);
          setIsFavorite(true);
        }
      } else {
        // Create a new wishlist if it doesn't exist
        await setDoc(wishlistRef, {
          items: [product] // Add new product
        });
        setMessage(`${product.title} added to wishlist!`);
        setIsFavorite(true);
      }
    }
  };

  const colors = ['#D3D3D3', '#FF0000']; // Example colors
  const sizes = product?.availableSizes || []; // Assuming availableSizes is an array in your product schema

  // Calculate pagination numbers
  const getPaginationNumbers = (currentPage, totalPages) => {
    const paginationNumbers = [];
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, currentPage + 1);

    if (totalPages <= 3) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage === 1) {
        endPage = 3;
      } else if (currentPage === totalPages) {
        startPage = totalPages - 2;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      paginationNumbers.push(i);
    }

    return paginationNumbers;
  };

  const paginationNumbers = getPaginationNumbers(currentPage, totalPages);

  // Display products for the current page
  const displayedProducts = relatedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handleAddReview = async () => {
    const newReview = {
      ...review,
      createdAt: new Date().toISOString(),
    };

    try {
      const productRef = doc(db, 'products', productId);
      const productDoc = await getDoc(productRef);

      if (productDoc.exists()) {
        const productData = productDoc.data();
        const updatedReviews = [...(productData.reviews || []), newReview];

        // Update the document with the updated reviews array
        await updateDoc(productRef, {
          reviews: updatedReviews,
        });

        // Update the local product state
        setProduct((prevProduct) => ({
          ...prevProduct,
          reviews: updatedReviews,
        }));

        setReview({ title: '', message: '', stars: 0 });
        alert('Review added successfully!');
      } else {
        alert('Product not found.');
      }
    } catch (error) {
      console.error('Error adding review:', error);
      alert('Failed to add review.');
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6 bg-white text-black font-poppins">
      {message && (
        <div className="bg-green-100 text-green-700 p-4 mb-4 rounded-md">
          {message}
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:space-x-12">
        {/* Product Details */}
        <div className="w-full lg:w-1/2 h-auto mb-6 lg:mb-0 bg-gray-200 flex items-center justify-center">
          <img
            className="w-full object-contain"
            src={product.images[0]} 
            // Using the first image
            alt={product.title}
            width={500}
            height={500}
          />
        </div>

        <div className="w-full lg:w-[35%]">
          <h1 className="text-2xl font-bold mb-4">{product.title}</h1>
          <div className="flex items-center mb-2">
            <span className="mr-2 flex items-center">
              {Array.from({ length: 5 }, (_, index) => (
                index < product.rating ? (
                  <AiFillStar key={index} size={20} className="text-[#FFAD33]" />
                ) : (
                  <CiStar key={index} size={20} className="text-[#FFAD33]" />
                )
              ))}
              <span className="text-gray-600 ml-2">
                ({product.reviews?.length || 0} Reviews)
              </span>
              <span className='text-black mx-4'>|</span>
              <span className="text-green-600">In Stock</span>
            </span>
          </div>
          <p className="text-2xl text-gray-800 font-semibold mb-4">INR {product.price}</p>
          <p className="text-gray-600 mb-4 leading-6 text-justify">
            {product.description}
          </p>

          <hr className="mb-4 border-gray-300" />

          {/* Color and Size Selection */}
          <div className="flex flex-col mb-4">
            <div className='flex'>
              <h3 className="text-lg font-semibold mb-2 mr-5">Colors:</h3>
              <div className="flex space-x-2 mb-4">
                {colors.map((color, index) => (
                  <button
                    key={index}
                    className={`w-8 h-8 rounded-full border-2 ${selectedColor === color ? "border-black" : "border-gray-300"}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
            </div>
            <div className='flex'>
              <h3 className="text-lg font-semibold mr-5 mb-2">Size:</h3>
              <div className="flex space-x-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    className={`px-4 py-2 border rounded-md ${selectedSize === size ? "border-none text-white bg-[#E57A7A]" : "border-gray-300"}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center mb-4 space-x-4">
            <div className="flex items-center border border-gray-300 rounded">
              <button className="px-3 py-1 text-gray-600" onClick={() => handleQuantityChange('decrement')}>-</button>
              <span className="px-4 py-1 border-l border-r">{quantity}</span>
              <button className="px-3 py-1 text-gray-600" onClick={() => handleQuantityChange('increment')}>+</button>
            </div>
            <button className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600" onClick={handleAddToCart}>Buy Now</button>
            {isFavorite ? (
              <AiFillHeart
                size={30}
                className="text-red-500 cursor-pointer"
                onClick={() => {
                  setIsFavorite(false);
                  // Optionally add logic to remove from wishlist
                }}
              />
            ) : (
              <AiOutlineHeart
                size={30}
                className="text-black cursor-pointer"
                onClick={handleAddToWishlist}
              />
            )}
          </div>

          <div className="mt-4 border-t pt-4">
            <div className="border flex py-4 px-2 mb-2 rounded-md">
              <div className="flex items-center space-x-2">
                <img src="/images/products/truck.png" alt="Free Delivery" className="w-8 h-8 mr-2" width={32} height={32} />
              </div>
              <div>
                <p className="text-black">Free Delivery</p>
                <p className="text-sm text-black underline">Get your order delivered free of charge.</p>
              </div>
            </div>
            <div className="border flex py-4 px-2 mb-2 rounded-md">
              <div className="flex items-center space-x-2">
                <img src="/images/products/truck.png" alt="Return" className="w-8 h-8 mr-2" width={32} height={32} />
              </div>
              <div>
                <p className="text-black">Return</p>
                <p className="text-sm text-black underline">Free 30 Days Return</p>
              </div>
            </div>
            <div className="border flex py-4 px-2 mb-2 rounded-md">
              <div className="flex items-center space-x-2">
                <img src="/images/products/truck.png" alt="Support" className="w-8 h-8 mr-2" width={32} height={32} />
              </div>
              <div>
                <p className="text-black">Customer Support</p>
                <p className="text-sm text-black underline">24/7 Customer Support.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mt-12 mb-6">Related Products</h2>
      <div className="flex flex-wrap gap-10">
        {displayedProducts.map((relatedProduct) => (
          <ProductCard key={relatedProduct.id} product={relatedProduct} />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-8 items-center">
        <div
          className={`cursor-pointer mr-12 ${currentPage === 1 ? "text-[#C4B0A9]" : "text-[#85716B]"}`}
          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
        >
          <FaArrowLeftLong size={24} />
        </div>

        {paginationNumbers.map((pageNumber) => (
          <button
            key={pageNumber}
            className={`w-8 h-8 ${currentPage === pageNumber ? "bg-[#85716B] text-white" : "bg-[#C4B0A9] text-white"} rounded-full mx-2`}
            onClick={() => setCurrentPage(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}

        <div
          className={`cursor-pointer ml-12 ${currentPage === totalPages ? "text-[#C4B0A9]" : "text-[#85716B]"}`}
          onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
        >
          <FaArrowRightLong size={24} />
        </div>
      </div>


      {/* Reviews Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>
        {/* Add Review Form */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Write a Review</h3>
          <input
            type="text"
            placeholder="Review Title"
            value={review.title}
            onChange={(e) => setReview({ ...review, title: e.target.value })}
            className="w-full p-2 border rounded-lg mb-2"
          />
          <textarea
            placeholder="Review Message"
            value={review.message}
            onChange={(e) => setReview({ ...review, message: e.target.value })}
            className="w-full p-2 border rounded-lg mb-2"
            rows={4}
          ></textarea>
          <div className="flex items-center mb-4">
            <span className="mr-2">Rating:</span>
            {Array.from({ length: 5 }, (_, index) => (
              <button
                key={index}
                className={`text-xl ${index < review.stars ? 'text-[#FFAD33]' : 'text-gray-400'}`}
                onClick={() => setReview({ ...review, stars: index + 1 })}
              >
                <AiFillStar />
              </button>
            ))}
          </div>
          <button
            onClick={handleAddReview}
            className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"
          >
            Submit Review
          </button>
        </div>

        {/* Display Reviews */}
        {product.reviews?.length ? (
          <div className="space-y-4">
            {product.reviews.map((rev, index) => (
              <div key={index} className="border-b py-4 shadow-sm hover:shadow-lg transition-shadow rounded-xl p-4">
                <div className="flex items-center mb-2">
                  {Array.from({ length: 5 }, (_, i) => (
                    <AiFillStar
                      key={i}
                      className={`${i < rev.stars ? 'text-[#FFAD33]' : 'text-gray-400'}`}
                    />
                  ))}
                </div>
                <h4 className="text-lg font-semibold">{rev.title}</h4>
                <p className="text-gray-600">{rev.message}</p>
                <p className="text-sm text-gray-500">
                  Reviewed on: {new Date(rev.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;