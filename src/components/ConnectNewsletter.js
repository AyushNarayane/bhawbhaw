"use client";
import { setUser } from "@/redux/userSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const ConnectNewsletter = ({ bg = "#C9ABA0" }) => {
  const dispatch = useDispatch();
  const { isSubscribedToNewsletter, email } = useSelector((state) => state.user.userData);
  const userId = useSelector((state) => state.user.userId);
  
  const [localIsSubscribed, setLocalIsSubscribed] = useState(isSubscribedToNewsletter);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isSubscribedToNewsletter) {
      setLocalIsSubscribed(true);
    }
  }, [isSubscribedToNewsletter]);

  const handleSubscribe = async () => {
    if (!email) {
      setMessage("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/newsletter/subscribeNewsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid: userId, email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setLocalIsSubscribed(true);
        dispatch(setUser({ isSubscribedToNewsletter: true }));
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error("Subscription error:", error);
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 md:py-20 font-poppins" style={{ backgroundColor: bg }}>
      <div className="container mx-auto text-center px-4">
        <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold text-white mb-4 leading-tight tracking-wider">
          Let&apos;s Connect Our Newsletter
        </h2>
        <p className="text-white md:mb-8 lg:mx-52 leading-relaxed tracking-wide">
          Stay updated with the latest grooming tips, offers, and pet care advice by subscribing to our newsletter.
        </p>
        <div className="flex flex-col md:flex-row mt-10 justify-center items-center gap-4">
          <input
            type="email"
            value={email || ""}
            onChange={(e) => dispatch(setSubscriptionStatus({ isSubscribed: false, email: e.target.value }))}
            placeholder="Enter your email"
            className="px-4 py-3 w-full md:w-80 rounded text-gray-700 border-none focus:outline-none"
            disabled={localIsSubscribed}
          />
          <button
            onClick={handleSubscribe}
            className="bg-[#4D3C36] text-white w-full md:w-auto px-8 md:px-14 text-lg font-medium py-3 rounded tracking-wider"
            disabled={loading || localIsSubscribed}
          >
            {loading ? "Subscribing..." : localIsSubscribed ? "Subscribed" : "Subscribe"}
          </button>
        </div>
        {message && <p className="text-white mt-4">{message}</p>}
      </div>
    </div>
  );
};

export default ConnectNewsletter;
