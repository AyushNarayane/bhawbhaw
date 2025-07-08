import Razorpay from 'razorpay';

// Log the keys to the server console for debugging
console.log("RAZORPAY_KEY_ID on server:", process.env.RAZORPAY_KEY_ID);
console.log("RAZORPAY_KEY_SECRET on server:", process.env.RAZORPAY_KEY_SECRET ? "Loaded" : "Not Loaded");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default razorpay;
