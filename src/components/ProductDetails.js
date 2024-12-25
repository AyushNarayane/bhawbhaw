// "use client";
// import React, { useEffect, useState, useContext } from "react";
// import ProductCard from "./ProductCard";
// import { CiStar } from "react-icons/ci";
// import { AiFillHeart, AiFillStar, AiOutlineHeart } from "react-icons/ai";
// import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6"; // Ensure you import the pagination arrows
// import { db } from '../../firebaseConfig';
// import { doc, setDoc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
// import { useRouter } from 'next/navigation';
// import { AuthContext } from '../app/context/AuthContext';
// import { CartWishlistContext } from '../app/context/CartWishlistContext';

// const ProductDetail = () => {
//   const router = useRouter();
//   const { user } = useContext(AuthContext);
//   const {
//     addToCart,
//     addToWishlist,
//     removeFromCart,
//     removeFromWishlist,
//     selectedProductId,
//     setSelectedProductId,
//   } = useContext(CartWishlistContext);
  
//   const [product, setProduct] = useState(null);
//   const [relatedProducts, setRelatedProducts] = useState([]);
//   const [selectedColor, setSelectedColor] = useState(null);
//   const [selectedSize, setSelectedSize] = useState(null);
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [quantity, setQuantity] = useState(1);
//   const [message, setMessage] = useState('');

//   // Pagination State
//   const [currentPage, setCurrentPage] = useState(1);
//   const productsPerPage = 3; // Set the number of products per page
//   const totalPages = Math.ceil(relatedProducts.length / productsPerPage);

//   useEffect(() => {
    // const productId = sessionStorage.getItem('selectedProductId');

//     if (!productId) {
//       console.error("Product ID is not available.");
//       router.push('/');
//       return;
//     }

//     const fetchProductDetails = async () => {
//       const productRef = doc(db, 'products', productId);
//       const productSnap = await getDoc(productRef);

//       if (productSnap.exists()) {
//         setProduct(productSnap.data());
//         fetchRelatedProducts(productSnap.data().subCategory);
//         setSelectedProductId(productId); // Set the selected product ID when the product is fetched
//       } else {
//         console.log("No such product!");
//       }
//     };

//     const fetchRelatedProducts = async (subCategory) => {
//       const q = query(collection(db, 'products'), where('subCategory', '==', subCategory));
//       const querySnapshot = await getDocs(q);
//       const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       setRelatedProducts(products);
//     };

//     fetchProductDetails();
//   }, [router]);

//   const handleQuantityChange = (type) => {
//     setQuantity((prevQuantity) =>
//       type === 'increase' ? prevQuantity + 1 : Math.max(1, prevQuantity - 1)
//     );
//   };

//   const handleAddToCart = async () => {
//     if (product && user?.uid) {
//       const cartRef = doc(db, 'carts', user.uid);
//       const cartDoc = await getDoc(cartRef);
      
//       if (cartDoc.exists()) {
//         const cartData = cartDoc.data();
//         const existingProduct = cartData.items.find(item => item.productId === product.productId);
  
//         if (existingProduct) {
//           // If the product exists in the cart, update the quantity
//           await setDoc(cartRef, {
//             items: cartData.items.map(item => 
//               item.productId === product.productId
//                 ? { ...item, quantity: item.quantity + quantity } // Increase quantity
//                 : item
//             )
//           }, { merge: true });
//         } else {
//           // If the product does not exist in the cart, add it
//           await setDoc(cartRef, {
//             items: [...cartData.items, { ...product, quantity }] // Add new product with quantity
//           }, { merge: true });
//         }
//       } else {
//         // Create a new cart if it doesn't exist
//         await setDoc(cartRef, {
//           items: [{ ...product, quantity }] // Add new product with quantity
//         });
//       }
  
//       setMessage(`${product.title} added to cart!`);
//       router.push('/cart');
//     }
//   };
  
//   // Function to handle adding to the wishlist
//   const handleAddToWishlist = async () => {
//     if (product && user?.uid) {
//       const wishlistRef = doc(db, 'wishlists', user.uid);
//       const wishlistDoc = await getDoc(wishlistRef);
      
//       if (wishlistDoc.exists()) {
//         const wishlistData = wishlistDoc.data();
//         const existingProduct = wishlistData.items.find(item => item.productId === product.productId);
  
//         if (!existingProduct) {
//           // If the product does not exist in the wishlist, add it
//           await setDoc(wishlistRef, {
//             items: [...wishlistData.items, product] // Add new product
//           }, { merge: true });
//           setMessage(`${product.title} added to wishlist!`);
//           setIsFavorite(true);
//         }
//       } else {
//         // Create a new wishlist if it doesn't exist
//         await setDoc(wishlistRef, {
//           items: [product] // Add new product
//         });
//         setMessage(`${product.title} added to wishlist!`);
//         setIsFavorite(true);
//       }
//     }
//   };

//   const colors = ['#D3D3D3', '#FF0000']; // Example colors
//   const sizes = product?.availableSizes || []; // Assuming availableSizes is an array in your product schema

//   // Calculate pagination numbers
//   const getPaginationNumbers = (currentPage, totalPages) => {
//     const paginationNumbers = [];
//     let startPage = Math.max(1, currentPage - 1);
//     let endPage = Math.min(totalPages, currentPage + 1);

//     if (totalPages <= 3) {
//       startPage = 1;
//       endPage = totalPages;
//     } else {
//       if (currentPage === 1) {
//         endPage = 3;
//       } else if (currentPage === totalPages) {
//         startPage = totalPages - 2;
//       }
//     }

//     for (let i = startPage; i <= endPage; i++) {
//       paginationNumbers.push(i);
//     }

//     return paginationNumbers;
//   };

//   const paginationNumbers = getPaginationNumbers(currentPage, totalPages);

//   // Display products for the current page
//   const displayedProducts = relatedProducts.slice(
//     (currentPage - 1) * productsPerPage,
//     currentPage * productsPerPage
//   );

//   if (!product) return <div>Loading...</div>;

//   return (
//     <div className="container mx-auto p-6 bg-white text-black font-poppins">
//       {message && (
//         <div className="bg-green-100 text-green-700 p-4 mb-4 rounded-md">
//           {message}
//         </div>
//       )}

//       <div className="flex flex-col lg:flex-row lg:space-x-12">
//         {/* Product Details */}
//         <div className="w-full lg:w-1/2 h-auto mb-6 lg:mb-0 bg-gray-200 flex items-center justify-center">
//           <img
//             className="w-full object-contain"
//             src={product.images[0]} // Using the first image
//             alt={product.title}
//             width={500}
//             height={500}
//           />
//         </div>

//         <div className="w-full lg:w-[35%]">
//           <h1 className="text-2xl font-bold mb-4">{product.title}</h1>
//           <div className="flex items-center mb-2">
//             <span className="mr-2 flex items-center">
//               {Array.from({ length: 5 }, (_, index) => (
//                 index < product.rating ? (
//                   <AiFillStar key={index} size={20} className="text-[#FFAD33]" />
//                 ) : (
//                   <CiStar key={index} size={20} className="text-[#FFAD33]" />
//                 )
//               ))}
//               <span className="text-gray-600 ml-2">({product.reviews} Reviews)</span>
//               <span className='text-black mx-4'>|</span>
//               <span className="text-green-600">In Stock</span>
//             </span>
//           </div>
//           <p className="text-2xl text-gray-800 font-semibold mb-4">INR {product.price}</p>
//           <p className="text-gray-600 mb-4 leading-6 text-justify">
//             {product.description}
//           </p>

//           <hr className="mb-4 border-gray-300" />

//           {/* Color and Size Selection */}
//           <div className="flex flex-col mb-4">
//             <div className='flex'>
//               <h3 className="text-lg font-semibold mb-2 mr-5">Colors:</h3>
//               <div className="flex space-x-2 mb-4">
//                 {colors.map((color, index) => (
//                   <button
//                     key={index}
//                     className={`w-8 h-8 rounded-full border-2 ${selectedColor === color ? "border-black" : "border-gray-300"}`}
//                     style={{ backgroundColor: color }}
//                     onClick={() => setSelectedColor(color)}
//                   />
//                 ))}
//               </div>
//             </div>
//             <div className='flex'>
//               <h3 className="text-lg font-semibold mr-5 mb-2">Size:</h3>
//               <div className="flex space-x-2">
//                 {sizes.map((size) => (
//                   <button
//                     key={size}
//                     className={`px-4 py-2 border rounded-md ${selectedSize === size ? "border-none text-white bg-[#E57A7A]" : "border-gray-300"}`}
//                     onClick={() => setSelectedSize(size)}
//                   >
//                     {size}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>

//           <div className="flex items-center mb-4 space-x-4">
//             <div className="flex items-center border border-gray-300 rounded">
//               <button className="px-3 py-1 text-gray-600" onClick={() => handleQuantityChange('decrease')}>-</button>
//               <span className="px-4 py-1 border-l border-r">{quantity}</span>
//               <button className="px-3 py-1 text-gray-600" onClick={() => handleQuantityChange('increase')}>+</button>
//             </div>
//             <button className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600" onClick={handleAddToCart}>Buy Now</button>
//             {isFavorite ? (
//               <AiFillHeart
//                 size={30}
//                 className="text-red-500 cursor-pointer"
//                 onClick={() => {
//                   setIsFavorite(false);
//                   // Optionally add logic to remove from wishlist
//                 }}
//               />
//             ) : (
//               <AiOutlineHeart
//                 size={30}
//                 className="text-black cursor-pointer"
//                 onClick={handleAddToWishlist}
//               />
//             )}
//           </div>

//           <div className="mt-4 border-t pt-4">
//             <div className="border flex py-4 px-2 mb-2 rounded-md">
//               <div className="flex items-center space-x-2">
//                 <img src="/images/products/truck.png" alt="Free Delivery" className="w-8 h-8 mr-2" width={32} height={32} />
//               </div>
//               <div>
//                 <p className="text-black">Free Delivery</p>
//                 <p className="text-sm text-black underline">Get your order delivered free of charge.</p>
//               </div>
//             </div>
//             <div className="border flex py-4 px-2 mb-2 rounded-md">
//               <div className="flex items-center space-x-2">
//                 <img src="/images/products/truck.png" alt="Return" className="w-8 h-8 mr-2" width={32} height={32} />
//               </div>
//               <div>
//                 <p className="text-black">Return</p>
//                 <p className="text-sm text-black underline">Free 30 Days Return</p>
//               </div>
//             </div>
//             <div className="border flex py-4 px-2 mb-2 rounded-md">
//               <div className="flex items-center space-x-2">
//                 <img src="/images/products/truck.png" alt="Support" className="w-8 h-8 mr-2" width={32} height={32} />
//               </div>
//               <div>
//                 <p className="text-black">Customer Support</p>
//                 <p className="text-sm text-black underline">24/7 Customer Support.</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <h2 className="text-2xl font-semibold mt-12 mb-6">Related Products</h2>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//         {displayedProducts.map((relatedProduct) => (
//           <ProductCard key={relatedProduct.id} product={relatedProduct} />
//         ))}
//       </div>

//       {/* Pagination Controls */}
//       <div className="flex justify-center mt-8 items-center">
//         <div  
//           className={`cursor-pointer mr-12 ${currentPage === 1 ? "text-[#C4B0A9]" : "text-[#85716B]"}`}
//           onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
//         >
//           <FaArrowLeftLong size={24} />
//         </div>

//         {paginationNumbers.map((pageNumber) => (
//           <button
//             key={pageNumber}
//             className={`w-8 h-8 ${currentPage === pageNumber ? "bg-[#85716B] text-white" : "bg-[#C4B0A9] text-white"} rounded-full mx-2`}
//             onClick={() => setCurrentPage(pageNumber)}
//           >
//             {pageNumber}
//           </button>
//         ))}

//         <div
//           className={`cursor-pointer ml-12 ${currentPage === totalPages ? "text-[#C4B0A9]" : "text-[#85716B]"}`}
//           onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
//         >
//           <FaArrowRightLong size={24} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetail;


//
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { db } from "../../firebaseConfig";
import { doc, getDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../app/context/AuthContext";
import { useCartWishlist } from "../app/context/CartWishlistContext";

const ProductDetails = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart, addToWishlist, removeFromCart, removeFromWishlist, selectedProductId, setSelectedProductId } = useCartWishlist();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isProductInCart, setIsProductInCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      const selectedProductId = sessionStorage.getItem('selectedProductId');
      if (!selectedProductId) return;

      try {
        const productRef = doc(db, "products", selectedProductId);
        const productSnapshot = await getDoc(productRef);
        if (productSnapshot.exists()) {
          setProduct({ id: productSnapshot.id, ...productSnapshot.data() });
        } else {
          setError("No product found with the given ID.");
          router.push("/404");
        }
      } catch (error) {
        setError("Error fetching product details.");
      } finally {
        setLoading(false);
      }
    };

    const checkWishlistStatus = async () => {
      if (!user) return;

      try {
        const wishlistRef = collection(db, "users", user.uid, "wishlist");
        const snapshot = await getDocs(wishlistRef);
        const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setIsInWishlist(products.some(item => item.id === selectedProductId));
      } catch (error) {
        console.error("Error checking wishlist status:", error);
      }
    };

    const checkCartStatus = async () => {
      if (!user) return;

      try {
        const cartDocRef = doc(db, "users", user.uid, "cart", selectedProductId);
        const cartDoc = await getDoc(cartDocRef);
        setIsProductInCart(cartDoc.exists());
      } catch (error) {
        console.error("Error checking cart status:", error);
      }
    };

    fetchProduct();
    checkWishlistStatus();
    checkCartStatus();
  }, [selectedProductId, user, router]);

  const handleCartAction = async () => {
    if (!user) {
      router.push("/signin");
      return;
    }
    if (isProductInCart) {
      await removeFromCart(selectedProductId);
    } else {
      await addToCart({ ...product, quantity, addedAt: serverTimestamp() });
    }
    setIsProductInCart(!isProductInCart);
  };

  const handleWishlistAction = async () => {
    if (!user) {
      router.push("/signin");
      return;
    }
    if (isInWishlist) {
      await removeFromWishlist(selectedProductId);
    } else {
      await addToWishlist({ ...product, addedAt: serverTimestamp() });
    }
    setIsInWishlist(!isInWishlist);
  };

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  if (loading) return <p>Loading product details...</p>;
  if (error) return <p>{error}</p>;
  return (
    <div className="p-10 font-poppins space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">{product?.title || "Product Title"}</h1>
        <button onClick={handleWishlistAction} className="flex items-center bg-[#FFEB3B] px-8 py-1 rounded-2xl">
          <img src="/images/navbar/heart.png" alt="Add to Wishlist" width={32} height={32} />
          <p>{isInWishlist ? 'Remove from Wishlist' : 'Add To Wishlist'}</p>
        </button>
      </div>

      <div className="rounded-lg p-6 flex justify-between items-start">
        <img src={product?.images || "/images/details/image.png"} alt={product?.title || "Product Image"} width={80} height={80} className="w-20 px-1 pt-2 pb-3 border border-black object-contain rounded-2xl" />

        <div className="flex space-x-6">
          <img src={product?.images || "/images/details/image.png"} alt={product?.title || "Product Image"} width={256} height={256} className="w-64 object-contain rounded-md" />

          <div className="space-y-4">
            <p className="text-sm"> {product?.title || "Product Title"}</p>
            {/* <p className="text-sm">Brand: {product?.brand || "Kopman"}</p> */}
            <p className="text-sm">Description: {product?.description || "Product description not available."}</p>
            <p className="text-sm">Category: {product?.category|| "Kopman"}</p>
            {/* <p className="text-sm">Size: {product?.size || "10 x 5 cm"}</p> */}
            <p className="text-sm">ID: {product?.id}</p>
          </div>
        </div>

        <div className="flex flex-col border border-[#F5D1DD] rounded-xl w-[30%] p-4 items-start space-y-2">
          <div className="text-2xl text-black font-semibold">Rs. {product?.price || "Price not available"}</div>
          <div className="flex">
            <img src="/images/details/freedelivery.png" alt="Free Delivery" width={28} height={28} className="w-7 object-contain pr-1" />
            <div className="text-black">Free Delivery</div>
          </div>

          <div className="flex items-center space-x-4">
            <button onClick={decreaseQuantity} className="px-3 py-1 bg-gray-300 rounded-md">-</button>
            <p>{quantity}</p>
            <button onClick={increaseQuantity} className="px-3 py-1 bg-gray-300 rounded-md">+</button>
          </div>

          <button onClick={handleCartAction} className="bg-[#D4C6C0] text-black w-full py-[0.5rem] text-left px-2 text-xs rounded-md border flex items-center">
        <img src="/images/details/cart.png" alt="Add to Cart" width={28} height={28} className="w-7 object-contain pr-2" />
        <p>{isProductInCart ? 'Remove from Cart' : 'Add To Cart'}</p>
      </button>

          <button onClick={() => { handleCartAction(); router.push("/cart"); }} className="bg-[#85716B] w-full text-white py-1 text-center px-2 text-sm rounded-md border">
            Buy Now
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-black">{product?.title || "Product Title"}</h2>
        <p className="text-black text-sm">{product?.longDescription || "Product details not available."}</p>
      </div>
    </div>
  );
};

export default ProductDetails;
