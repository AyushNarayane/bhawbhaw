import Image from "next/image";
import React from "react";

const OfferCards = () => {
  const cards = [
    {
      title: "Pet Cafe",
      description: "Coffee for you, treats for them",
      image: "/images/Home/f1.jpg",
      buttonText: "Discover Now",
    },
    {
      title: "Holiday travel",
      description: "Special Diwali Day Offer",
      image: "/images/Home/f2.jpg",
      buttonText: "Discover Now",
    },
    {
      title: "Pet Insurance",
      description: "Vet Bills? No worries!",
      image: "/images/Home/f3.jpg",
      buttonText: "Discover Now",
    },
    {
      title: "Pet Events",
      description: "",
      image: "/images/Home/f4.jpg",
      buttonText: "Discover Now",
    },
  ];

  return (
    <section className="py-16 px-4 md:px-8 font-prompt">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {cards.map((card, index) => (
          <div
            key={index}
            className="rounded-xl p-6 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-lg md:text-2xl font-bold text-black mb-4">{card.title}</h3>
              {card.description && (
                <p className="text-gray-700 mb-3 text-sm md:text-lg">{card.description}</p>
              )}
              <Image
                width={800}
                height={500}
                src={card.image}
                alt={card.title}
                className="w-full h-60 object-contain rounded-md"
              />
            </div>
            <button className="mt-6 max-w-44 bg-[#FF6B6B] text-white text-sm md:text-lg whitespace-nowrap font-semibold py-3 px-4 rounded-full flex items-center justify-center hover:bg-red-500 transition">
              {card.buttonText}
              <span className="ml-2">
                <Image
                  width={800}
                  height={500}
                  src="/images/navbar/image.png"
                  alt="Icon"
                  className="w-5 h-5 ml-2"
                />
              </span>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OfferCards;
