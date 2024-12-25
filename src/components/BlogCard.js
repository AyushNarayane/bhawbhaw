// BlogCard.js
import React from 'react';

const BlogCard = ({ title, category, date, image }) => {
  return (
    <div className="bg-[#F3EAE7] rounded shadow-md overflow-hidden font-poppins">
      <img
        src={image}
        alt={title}
        className="w-full h-auto object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl text-[#2E2624]">{title}</h3>
        <div className="flex justify-between text-sm text-gray-500 mt-4">
          <span className="border border-yellow-500 px-5 py-1 rounded-2xl" >{category}</span>
          <span>{date}</span>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
