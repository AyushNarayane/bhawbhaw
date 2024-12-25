// import { doc, setDoc, collection, serverTimestamp } from "firebase/firestore";
// import { db } from "./firebaseConfig.js";

// const categories = [
//   { category: "Dogs", subCategory: "Dry Food", name: "Dog Food" },
//   { category: "Cats", subCategory: "Wet Food", name: "Cat Food" },
//   { category: "Parrots", subCategory: "Vitamins", name: "Parrot Vitamins" },
//   { category: "Hamsters", subCategory: "Toys", name: "Hamster Toy" }
// ];

// function generateProductData(category, i) {
//   const productId = `PID${Math.floor(Date.now() / 1000)}${Math.floor(Math.random() * 1000)}`;

//   return {
    // category: category.category,
    // subCategory: category.subCategory,
    // title: `${category.name} Product ${i + 1}`,
    // description: `Description for ${category.name} product ${i + 1}.`,
    // price: Math.floor(Math.random() * (700 - 60 + 1)) + 60,
    // images: [
    //   "https://firebasestorage.googleapis.com/v0/b/d-bhaw-bhaw.appspot.com/o/bigproduct.png?alt=media&token=faab87bb-8703-4288-995c-abac5e326c24"
    // ],
    // createdAt: serverTimestamp(),
    // updatedAt: serverTimestamp(),
    // status: "approved",
    // productId: productId,
    // vendorId: `UID${category.index}`,
    // vendorUID: `UID${category.index}`,
    // warranty: "yes"
//   };
// }

// function generateRandomPassword(length) {
//   const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
//   let password = "";
//   for (let i = 0; i < length; i++) {
//     password += chars.charAt(Math.floor(Math.random() * chars.length));
//   }
//   return password;
// }

// async function createUserWithProducts(userIndex) {
//   const uid = `UID${Date.now()}`;
//   const username = `user${userIndex}@example.com`;
//   const password = generateRandomPassword(6);

//   const userData = {
//     uid: uid,
//     username: username,
//     password: password
//   };

//   try {
//     await setDoc(doc(db, "users", uid), userData);
//     console.log(`User created with UID: ${uid}, Username: ${username}, Password: ${password}`);

//     for (let index = 0; index < categories.length; index++) {
//       const category = categories[index];

//       for (let i = 0; i < 4; i++) {
//         const productData = generateProductData(category, i);

//         const wishlistRef = doc(collection(db, "users", uid, "wishlist"), productData.productId);
//         await setDoc(wishlistRef, productData);
//         console.log(`Product added to wishlist with ID: ${productData.productId}`);

//         const cartRef = doc(collection(db, "users", uid, "cart"), productData.productId);
//         await setDoc(cartRef, productData);
//         console.log(`Product added to cart with ID: ${productData.productId}`);
//       }
//     }
//   } catch (error) {
//     console.error("Error creating user or adding products: ", error);
//   }
// }

// async function createMultipleUsersWithProducts() {
//   for (let i = 0; i < 4; i++) {
//     await createUserWithProducts(i + 1);
//   }
// }

// createMultipleUsersWithProducts();


// to add coupons
// import { doc, setDoc, serverTimestamp } from "firebase/firestore";
// import { db } from "./firebaseConfig.js";

// const generateRandomCouponId = () => {
//   return `FREE${Math.floor(Math.random() * 1000)}`;
// };

// async function addDummyCoupons() {
//   for (let i = 0; i < 10; i++) {
//     const couponId = generateRandomCouponId();
    
//     const couponData = {
//       couponId: couponId,
//       createdAt: serverTimestamp(),
//       minimumPrice: `${Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000}`, 
//       percentageDiscount: `${Math.floor(Math.random() * (50 - 5 + 1)) + 5}`,
//       status: "active",
//       updatedAt: serverTimestamp(),
//     };

//     try {
//       await setDoc(doc(db, "coupons", couponId), couponData);
//       console.log(`Coupon added with ID: ${couponId}`);
//     } catch (error) {
//       console.error("Error adding coupon: ", error);
//     }
//   }
// }

// addDummyCoupons();



// to add products
// import { doc, setDoc, serverTimestamp } from "firebase/firestore";
// import { db } from "./firebaseConfig.js"; // Ensure firebaseConfig.js is set up correctly

// const categories = [
//   { category: "Dogs", subCategory: "Dry Food", name: "Dog Food" },
//   { category: "Cats", subCategory: "Wet Food", name: "Cat Food" },
//   { category: "Parrots", subCategory: "Vitamins", name: "Parrot Vitamins" },
//   { category: "Hamsters", subCategory: "Toys", name: "Hamster Toy" }
// ];

// async function addDummyProducts() {
//   for (let index = 0; index < categories.length; index++) {
//     const category = categories[index];

//     for (let i = 0; i < 4; i++) {
//       const productId = `PID${Math.floor(Date.now() / 1000)}${Math.floor(Math.random() * 1000)}`; // Ensuring unique product ID

//       // Generating random rating and reviews
//       const rating = (Math.random() * (5 - 3.5) + 3.5).toFixed(1); // Random rating between 3.5 and 5.0
//       const reviews = Math.floor(Math.random() * (100 - 10 + 1)) + 10; // Random number of reviews between 10 and 100

//       const productData = {
//         category: category.category,
//         subCategory: category.subCategory,
//         title: `${category.name} Product ${i + 1}`,
//         description: `Description for ${category.name} product ${i + 1}.`,
//         price: Math.floor(Math.random() * (700 - 60 + 1)) + 60, // Random price between 60 and 700
//         images: [
//           "https://firebasestorage.googleapis.com/v0/b/d-bhaw-bhaw.appspot.com/o/bigproduct.png?alt=media&token=faab87bb-8703-4288-995c-abac5e326c24"
//         ],
//         rating: parseFloat(rating), // Adding rating
//         reviews: reviews, // Adding reviews
//         createdAt: serverTimestamp(),
//         updatedAt: serverTimestamp(),
//         status: "approved",
//         productId: productId,
//         vendorId: `UID${index}`,
//         vendorUID: `UID${index}`,
//         warranty: "yes"
//       };

//       try {
//         // Adding product to the "products" collection in Firestore
//         await setDoc(doc(db, "products", productId), productData);
//         console.log(`Product added with ID: ${productId}`);
//       } catch (error) {
//         console.error("Error adding product: ", error);
//       }
//     }
//   }
// }

// addDummyProducts();
//add dummy addresses
import { doc, setDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebaseConfig.js";

// Specified user IDs
const targetUserIds = ["UID1731060902", "UID1731095522", "UID1730928395"];

// Dummy address data
const dummyAddresses = [
  {
    firstName: "Rohan",
    lastName: "Sharma",
    address: "123 MG Road",
    apartment: "Apt 201",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400001",
    latitude: 19.076,
    longitude: 72.8777,
  },
  {
    firstName: "Meera",
    lastName: "Iyer",
    address: "456 Brigade Road",
    apartment: "Villa 5",
    city: "Bangalore",
    state: "Karnataka",
    postalCode: "560001",
    latitude: 12.9716,
    longitude: 77.5946,
  },
  {
    firstName: "Aryan",
    lastName: "Kapoor",
    address: "789 Park Street",
    apartment: "Flat 8B",
    city: "Delhi",
    state: "Delhi",
    postalCode: "110001",
    latitude: 28.6139,
    longitude: 77.209,
  },
];

// Generate custom document ID for addresses in the format AID{timestamp}
const generateCustomDocId = () => {
  const timestamp = Math.floor(Date.now() / 1000);
  return `AID${timestamp}`; // Generate unique ID with the prefix "AID" followed by the timestamp
};

// Add dummy addresses for specified users
async function addDummyAddressesToSpecificUsers() {
  for (const userId of targetUserIds) {
    try {
      // Reference to the 'addresses' subcollection for each userId
      const userAddressesRef = collection(db, "saved_addresses", userId, "addresses");
      
      for (const address of dummyAddresses) {
        const docId = generateCustomDocId(); // Generate unique ID for each address
        
        // Adding the address with userId and other details to the 'addresses' subcollection
        await setDoc(doc(userAddressesRef, docId), {
          ...address,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      console.log(`Dummy addresses added for userId: ${userId}`);
    } catch (error) {
      console.error(`Error adding addresses for userId ${userId}:`, error);
    }
  }
}

addDummyAddressesToSpecificUsers();

