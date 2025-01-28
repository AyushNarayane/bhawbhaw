"use client";

import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "firebaseConfig";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/userSlice";

const HelpdeskPage = () => {
  const [queries, setQueries] = useState([]);
  const [newQuery, setNewQuery] = useState({ message: "", category: "" });
  const [userId, setUserId] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchQueries = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (!storedUser?.userId) {
        console.error("User ID not found. Redirecting to sign-in.");
        router.push("/signin");
        return;
      }

      setUserId(storedUser.userId);
      dispatch(setUser(storedUser));

      try {
        const docRef = doc(db, "userQueries", storedUser.userId);
        const userDoc = await getDoc(docRef);

        if (userDoc.exists()) {
          setQueries(userDoc.data().queries || []);
        } else {
          setQueries([]);
        }
      } catch (error) {
        console.error("Error fetching queries:", error);
        toast.error("Failed to load queries.");
      }
    };

    fetchQueries();
  }, [router]);

  const handleAddQuery = async () => {
    if (!newQuery.category || !newQuery.message) {
      toast.error("Please provide a category and message for your query.");
      return;
    }

    const newQueryObject = {
      category: newQuery.category,
      message: newQuery.message,
      createdAt: Timestamp.now(),
      queryId: `UQ${Math.floor(Date.now() / 1000)}`,
      status: "unresolved",
    };

    try {
      setIsLoading(true);

      const userRef = doc(db, "userQueries", userId);
      const userDoc = await getDoc(userRef);

      let updatedQueries = [];
      let userDetails = {};

      if (userDoc.exists()) {
        updatedQueries = [...(userDoc.data().queries || []), newQueryObject];
        userDetails = userDoc.data().userDetails;
      } else {
        const userDetailsRef = doc(db, "users", userId);
        const userDetailsDoc = await getDoc(userDetailsRef);

        userDetails = userDetailsDoc.data();
        updatedQueries = [newQueryObject];
      }

      await setDoc(userRef, { userDetails, queries: updatedQueries });
      setQueries(updatedQueries);

      setNewQuery({ category: "", message: "" });
      toast.success("Query submitted successfully!");
    } catch (error) {
      console.error("Error submitting query:", error);
      toast.error("Failed to submit query.");
    }

    setIsLoading(false);
  };

  return (
    <div className="p-6 font-montserrat bg-gray-50 min-h-screen text-black">
      <Toaster />
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-red-600">
          Helpdesk
        </h1>

        {/* Query Form */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Submit a Query
          </h2>
          <input
            type="text"
            placeholder="Category"
            value={newQuery.category}
            onChange={(e) =>
              setNewQuery({ ...newQuery, category: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />
          <textarea
            placeholder="Query Message"
            value={newQuery.message}
            onChange={(e) =>
              setNewQuery({ ...newQuery, message: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            rows={4}
          ></textarea>
          <button
            onClick={handleAddQuery}
            className={`w-full text-white px-4 py-3 rounded-lg font-semibold hover:bg-red-600 transition duration-300 ${
              isLoading ? "bg-red-400 cursor-not-allowed" : "bg-red-500"
            }`}
            disabled={isLoading}
          >
            Submit Query
          </button>
        </div>

        {/* Display Queries */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Your Queries
          </h2>
          {queries.length === 0 ? (
            <div className="text-center text-gray-600 bg-gray-100 p-4 rounded-lg">
              <p>No queries found. Submit your first query above!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {queries.map((query) => (
                <div
                  key={query.queryId}
                  className="border rounded-lg p-4 bg-gray-50 shadow-sm hover:shadow-md transition duration-200"
                >
                  <p className="text-lg font-semibold text-gray-800">
                    {query.category}
                  </p>
                  <p className="text-gray-700">{query.message}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Submitted on: {query.createdAt.toDate().toLocaleString()}
                  </p>
                  <p
                    className={`text-sm font-bold mt-2 ${
                      query.status === "unresolved"
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    Status: {query.status}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HelpdeskPage;
