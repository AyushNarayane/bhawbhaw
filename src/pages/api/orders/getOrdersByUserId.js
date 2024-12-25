import { db } from "../../../../firebaseConfig"; 
import { collection, query, where, getDocs } from "firebase/firestore";


export default async function getOrdersByUserId(req, res) {
  if (req.method === "GET") {
    const { userId } = req.query;  

   
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    try {
      const ordersRef = collection(db, "orders");
      const q = query(ordersRef, where("userId", "==", userId)); 

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return res.status(404).json({ success: false, message: "No orders found for this user" });
      }

      const orders = [];
      querySnapshot.forEach(doc => {
        orders.push({ id: doc.id, ...doc.data() });
      });

      return res.status(200).json({ success: true, orders });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Error fetching orders", error: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
}
