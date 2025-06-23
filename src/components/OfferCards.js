import Image from "next/image";
import React from "react";

const OfferCards = () => {
  const cards = [
    {
      title: "Pet Cafe",
      description: "Coffee for you, treats for them",
      image: "/images/Home/f2.jpg",
      buttonText: "Discover Now",
    },
    {
      title: "Holiday travel",
      description: "Travel with your pet",
      image: "/images/Home/f4.jpg",
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
      description: "Join us for a day of fun and games",
      image: "/images/Home/f1.jpg",
      buttonText: "Discover Now",
    },
  ];

  return (
    <section className="py-20 px-4 md:px-8 font-prompt bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16">
          Special <span className="text-red-500">Offers</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{card.title}</h3>
                  {card.description && (
                    <p className="text-gray-600 text-lg">{card.description}</p>
                  )}
                </div>
                <div className="relative h-64 rounded-xl overflow-hidden">
                  <Image
                    width={800}
                    height={500}
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>
                <button className="w-full bg-red-500 text-white text-lg font-semibold py-3 px-6 rounded-xl hover:bg-red-600 transition-all duration-300 flex items-center justify-center group">
                  {card.buttonText}
                  <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300">
                    <Image
                      width={24}
                      height={24}
                      src="/images/navbar/image.png"
                      alt="Icon"
                      className="w-6 h-6"
                    />
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OfferCards;
