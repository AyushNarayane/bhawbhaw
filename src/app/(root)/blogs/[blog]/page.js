"use client";

import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "firebaseConfig";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const BlogPage = ({ params }) => {
  const { blog } = params;
  const [blogData, setBlogData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!blog) return;

    // Function to fetch blog data based on slug field
    const fetchBlogData = async () => {
      try {
        // Query the blogs collection where the 'slug' field matches the slug from URL
        const blogQuery = query(
          collection(db, "blogs"),
          where("slug", "==", blog)
        );
        const querySnapshot = await getDocs(blogQuery);

        if (!querySnapshot.empty) {
          const blogDoc = querySnapshot.docs[0].data();
          setBlogData(blogDoc); // Set the blog data to state
        } else {
          console.error("No blog found with this slug!");
        }
      } catch (error) {
        console.error("Error fetching blog data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, [blog]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!blogData) {
    return <div>Blog not found</div>;
  }

  return (
    <div className="px-6 font-poppins bg-gray-50 min-h-screen py-16">
      {/* Blog Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-gray-900 leading-tight">
          {blogData.title}
        </h1>
        <p className="text-lg sm:text-xl text-gray-500 mt-3">
          {new Date(blogData.createdAt).toLocaleDateString()}
        </p>
        <p className="text-xl sm:text-2xl text-gray-700 mt-2">
          {blogData.category}
        </p>
      </div>

      {/* Blog Content with Image on the Left */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Blog Image */}
        <div className="flex-shrink-0 w-full md:w-1/2">
          <div className="rounded-lg overflow-hidden shadow-lg">
            <Image
              src={blogData.image}
              alt={blogData.title}
              width={1200}
              height={800}
              className="w-full h-auto object-cover object-center" // Adjusted the object-fit to ensure no overflow
            />
          </div>
        </div>

        {/* Blog Text Content */}
        <div className="w-full md:w-1/2 text-lg sm:text-xl text-gray-800 space-y-8 leading-relaxed">
          <div
            className="content-text"
            dangerouslySetInnerHTML={{ __html: blogData.editorDescription }} // Render HTML content safely
          ></div>

          <div className="mt-10">
            {/* Optional footer or additional content */}
            <p className="text-lg text-gray-500">
              <i>Thank you for reading!</i>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
