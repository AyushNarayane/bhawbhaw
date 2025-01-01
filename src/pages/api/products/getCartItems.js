import { doc, getDoc } from "firebase/firestore"
import { db } from "firebaseConfig";

export const getCartItems = async (req, res) => {
    const { userId } = req.query

    try {
        const cartRef = doc(db, 'cart', userId)
        const cartDoc = await getDoc(cartRef)

        if (cartDoc.exists()) {
            return cartDoc.data()
        }
    } catch (error) {
        console.log(error)
    }
}