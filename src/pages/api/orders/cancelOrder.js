import { db } from "../../../../firebaseConfig"; 
import { getDoc, doc, updateDoc } from "firebase/firestore";

export default async function cancelOrder(req, res) {
  if (req.method === "POST") {
    const { orderId } = req.query; 
    if (!orderId) {
      return res.status(400).json({ success: false, message: "Order ID is required" });
    }
    try {
      const orderRef = doc(db, "orders", orderId);
      const orderSnapshot = await getDoc(orderRef);
      if (!orderSnapshot.exists()) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }
      const orderData = orderSnapshot.data();
   
      if (orderData.status === "cancelled") {
        return res.status(400).json({ success: false, message: "Order is already canceled" });
      }   
      await updateDoc(orderRef, {
        status: "cancelled",
        cancelledAt: new Date(),  
      });
      return res.status(200).json({ success: true, message: "Order has been canceled successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Error cancelling the order", error: error.message });
    }
  } else {
 
    res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
}
