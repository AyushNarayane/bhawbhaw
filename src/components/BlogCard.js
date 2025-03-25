import React from "react";
import Link from "next/link";

const BlogCard = ({ title, category, date, image, slug }) => {
  return (
    <div className="border rounded-lg shadow-lg overflow-hidden">
      <img src={image} alt={title} className="w-full h-56 object-cover" />
      <div className="p-4">
        <h3 className="text-2xl font-semibold">{title}</h3>
        <p className="text-gray-500 text-sm">{category}</p>
        <p className="text-gray-400 text-xs">{date}</p>
        <div className="mt-4">
          <Link
            href={`/blogs/${slug}`}
            className="text-[#FFEB3B] hover:text-black font-bold"
          >
            Read more
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
