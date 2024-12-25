
import React from 'react';

const LatestBlogCard = ({ image, title, category, date }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden font-poppins">
      <img src={image} alt={title} className="w-full h-72 object-cover" />
      <div className="p-3">
        <h3 className="text-xl font-[900] mb-5">{title}</h3>
        <div className="flex items-center justify-between text-black text-sm">
          <span className="border border-orange-500 px-3 py-1 rounded-2xl text-black">
            {category}
          </span>
          <span>{date}</span>
        </div>
      </div>
    </div>
  );
};

export default LatestBlogCard;
