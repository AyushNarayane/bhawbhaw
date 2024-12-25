import React from "react";

const OfferCards = () => {
  const cards = [
    {
      title: "Expert pet Services",
      description: "",
      image: "/images/Home/image-1.png",
      buttonText: "Discover Now",
    },
    {
      title: "20% OFF on pet items",
      description: "Special Diwali Day Offer",
      image: "/images/Home/image-2.png",
      buttonText: "Discover Now",
    },
    {
      title: "Pet health and Activity",
      description: "",
      image: "/images/Home/image-3.png",
      buttonText: "Discover Now",
    },
    {
      title: "Grooming Tips",
      description: "Get grooming tips from professional vets",
      image: "/images/Home/image-4.png",
      buttonText: "Discover Now",
    },
  ];

  return (
    <section className="py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {cards.map((card, index) => (
          <div
            key={index}
            className="rounded-xl p-6 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-bold text-black mb-4">{card.title}</h3>
              {card.description && (
                <p className="text-gray-700 mb-4 text-sm">{card.description}</p>
              )}
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-40 object-cover rounded-md"
              />
            </div>
            <button className="mt-6 max-w-44 bg-[#FF6B6B] text-white text-sm font-semibold py-3 px-4 rounded-full flex items-center justify-center hover:bg-red-500 transition">
              {card.buttonText}
              <span className="ml-2">
              <img
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
