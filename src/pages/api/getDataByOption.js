import { collection, getDocs } from "firebase/firestore";
import { db } from "firebaseConfig";

export default async function handler(req, res) {
  const { option } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!option) {
    return res.status(400).json({ error: "Option parameter is missing" });
  }

  try {
    const collectionName = {
      seller: "vendors",
      user: "users",
      products: "products",
    }[option] || "vendors";

    const collectionRef = collection(db, collectionName);
    const querySnapshot = await getDocs(collectionRef);

    if (querySnapshot.empty) {
      return res.status(404).json({ error: `No data found for ${option}` });
    }

    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json({ data });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: "Failed to fetch data" });
  }
}
