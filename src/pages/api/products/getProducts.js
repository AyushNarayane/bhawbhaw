// import { db } from "../../../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { db } from "firebaseConfig";

export default async function getProducts(req, res) {
  if (req.method === "GET") {
    try {
      const snapshot = await getDocs(collection(db, "products"));
      const products = snapshot.docs.map(doc => doc.data());
      return res.status(200).json({ success: true, products });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  } else {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
}

// import { db } from "../../../../firebaseConfig";
// import { collection, getDocs } from "firebase/firestore";

// export default async function getProducts(req, res) {
//   if (req.method === "GET") {
//     try {
//       const snapshot = await getDocs(collection(db, "products"));
//       const products = snapshot.docs.map((doc) => doc.data());

//       // Duplicate the same product data 10 times for testing
//       const duplicatedProducts = [];
//       for (let i = 0; i < 10; i++) {
//         products.forEach((product) => {
//           duplicatedProducts.push({ ...product, id: `${product.id}_${i}` }); // Add unique ID for each duplicate
//         });
//       }

//       return res.status(200).json({ success: true, products: duplicatedProducts });
//     } catch (error) {
//       return res.status(500).json({ success: false, message: error.message });
//     }
//   } else {
//     return res.status(405).json({ success: false, message: "Method Not Allowed" });
//   }
// }
