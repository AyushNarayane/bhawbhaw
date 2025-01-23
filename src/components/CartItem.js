import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const CartItem = ({ item, selectedItems, handleItemSelection, handleDelete, handleQuantityChange }) => {
  return (
    <div key={item.productId} className="border border-gray-300 bg-white p-4 rounded-lg flex items-center justify-between mb-4 flex-col sm:flex-row">
      <div className="flex items-center mb-4 sm:mb-0">
        <input
          type="checkbox"
          checked={selectedItems.includes(item.productId)}
          onChange={() => handleItemSelection(item.productId)}
          className="mr-4"
        />
        <img src={item.images[0]} alt={item.title} className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-lg bg-[#f0eeed]" />
        <div className="ml-4">
          <Link href={`/productdetails/${item.productId}`} target="_blank" className="font-bold text-base md:text-lg hover:underline underline-offset-2">
            {item.title}
          </Link>
          <p className="text-xs md:text-sm my-1">Size: <span className="text-[#676767]">{item.size}</span></p>
          <p className="font-bold text-lg">INR {item.sellingPrice}</p>
        </div>
      </div>
      <div className="flex lg:flex-col sm:flex-row-reverse items-center lg:items-end w-full lg:w-auto justify-between">
        <Image
          height={100}
          width={100}
          src="/images/common/dustbin.png"
          alt="Delete"
          className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer lg:mt-2 ml-4 sm:ml-0"
          onClick={() => handleDelete(item)}
        />
        <div className="flex items-center mt-12 bg-[#F0F0F0] px-2 py-1 rounded-2xl">
          <button className="px-2" onClick={() => handleQuantityChange(item.productId, -1)}>-</button>
          <span className="mx-2">{item.quantity || 1}</span>
          <button className="px-2" onClick={() => handleQuantityChange(item.productId, 1)}>+</button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;