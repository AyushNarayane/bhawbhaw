// AllBlogs.js
import React from 'react';
import BlogCard from './BlogCard'; // Import the BlogCard component
import Link from "next/link";


const AllBlogs = () => {
  // Blog data array
  const blogPosts = [
    {
      title: "Starting your new friendship off on the right paw",
      category: "ADOPTING A PET",
      date: "5.12.2024",
      image: "/images/blogs/blog1.png", // Replace with actual image path
    },
    {
      title: "Your guide to pet care essentials",
      category: "PET CARE",
      date: "8.12.2024",
      image: "/images/blogs/blog2.png", // Replace with actual image path
    },
    {
      title: "Choosing the right food for your pet",
      category: "PET NUTRITION",
      date: "9.13.2024",
      image: "/images/blogs/blog3.png", // Replace with actual image path
    },
    {
      title: "Tips for a happy pet",
      category: "PET CARE",
      date: "10.14.2024",
      image: "/images/blogs/blog1.png", // Replace with actual image path
    },
    {
      title: "Your guide to pet care essentials",
      category: "PET CARE",
      date: "8.12.2024",
      image: "/images/blogs/blog2.png", // Replace with actual image path
    },
    {
      title: "Choosing the right food for your pet",
      category: "PET NUTRITION",
      date: "9.13.2024",
      image: "/images/blogs/blog3.png", // Replace with actual image path
    },
    {
      title: "Tips for a happy pet",
      category: "PET CARE",
      date: "10.14.2024",
      image: "/images/blogs/blog1.png", // Replace with actual image path
    },
    {
      title: "Your guide to pet care essentials",
      category: "PET CARE",
      date: "8.12.2024",
      image: "/images/blogs/blog2.png", // Replace with actual image path
    },
    {
      title: "Choosing the right food for your pet",
      category: "PET NUTRITION",
      date: "9.13.2024",
      image: "/images/blogs/blog3.png", // Replace with actual image path
    },
  ];

  return (
    <div className="px-4  font-poppins mb-20">
      {/* Blog Header */}
      <div className="text-center mb-12">
        <h1 className="text-[5rem] sm:text-[6rem] md:text-[7rem] font-bold text-[#85716B]">BLOGS</h1>
        <p className="text-lg text-black -mt-7 mx-2 md:mx-52">
          We know your pets are cherished members of your family. That’s why we provide loving,
          personalized pet sitting services tailored to their needs.
        </p>
        <Link href="/book-service">
        <button className="mt-6 bg-[#FFEB3B] text-black py-2 px-4 rounded text-xl">
          Book Now
        </button>
        </Link>
      </div>

      {/* Latest Blog Posts Section */}
      <div className="text-center mb-8">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-medium text-[#4D413E]">Latest blog posts</h2>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post, index) => (
          <BlogCard
            key={index}
            title={post.title}
            category={post.category}
            date={post.date}
            image={post.image}
          />
        ))}
      </div>
    </div>
  );
};

export default AllBlogs;
