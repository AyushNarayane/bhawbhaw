// LatestBlog.js
import React from 'react';
import LatestBlogCard from './LastestBlogCard';

const LatestBlog = () => {
  // Array of blog post objects
  const blogPosts = [
    {
      image: '/images/blogs/blog3.png',
      title: 'Starting your new friendship off on the right paw',
      category: 'ADOPTING A PET',
      date: '9.12.2024',
    },
    {
      image: '/images/blogs/blog2.png',
      title: 'How to Prepare Your Home for a New Pet',
      category: 'ADOPTING A PET',
      date: '8.20.2024',
    },
    {
      image: '/images/blogs/blog1.png',
      title: 'Top 10 Tips for Training Your New Puppy',
      category: 'ADOPTING A PET',
      date: '7.15.2024',
    },
  ];

  return (
    <div className="bg-white px-4 lg:px-12 py-12 text-black font-poppins">
      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="lg:text-7xl text-3xl font-semibold mb-10">Latest blog posts</h2>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blogPosts.map((post, index) => (
          <LatestBlogCard
            key={index}
            image={post.image}
            title={post.title}
            category={post.category}
            date={post.date}
          />
        ))}
      </div>

      {/* Browse All Blogs Link */}
      <div className="text-center mt-8">
        <a href="/blogs" className="text-lg font-semibold text-gray-800 hover:text-gray-500">
          Browse all Blogs
        </a>
      </div>
    </div>
  );
};

export default LatestBlog;
