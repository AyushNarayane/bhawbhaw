"use client";

import React, { useState, useEffect } from "react";
import BlogCard from "./BlogCard";
import { db } from "firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const AllBlogs = () => {
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    // Fetch the blog posts from Firestore
    const fetchBlogPosts = async () => {
      try {
        const blogCollection = collection(db, "blogs");
        const blogSnapshot = await getDocs(blogCollection);
        const blogList = blogSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBlogPosts(blogList);
      } catch (error) {
        console.error("Error fetching blog posts: ", error);
      }
    };

    fetchBlogPosts();
  }, []);

  return (
    <div className="px-4 font-poppins mb-20">
      {/* Blog Header */}
      <div className="text-center">
        <h1 className="text-[5rem] sm:text-[6rem] md:text-[7rem] font-bold text-[#85716B]">
          BLOGS
        </h1>
      </div>

      {/* Latest Blog Posts Section */}
      <div className="text-center mb-8">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-medium text-[#4D413E]">
          Latest blog posts
        </h2>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post) => (
          <BlogCard
            key={post.id}
            title={post.title}
            category={post.category}
            date={new Date(post.createdAt).toLocaleDateString()}
            image={post.image}
            slug={post.slug}
          />
        ))}
      </div>
    </div>
  );
};

export default AllBlogs;
