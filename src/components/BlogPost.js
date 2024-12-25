import React from "react";

const BlogPost = () => {
  // Define a blog post data object
  const blogData = {
    image: "/images/blogs/bigimage.png", // Replace with the actual image path
    title: "Starting your new friendship off on the right paw",
    date: "9.13.2024",
    category: "ADOPTING A PET",
    author: {
      name: "Michael Johnson",
      image: "/images/blogs/bigimage.png", // Replace with the actual author image path
      title: "Pet Owner, Happy Paws",
    },
    content: [
      {
        heading: "How to choose when to adopt a new pet?",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Semper nulla elementum, lobortis feugiat eros rhoncus, sem est molestie. Quam nisi, purus adipiscing dictumst fringilla. Lorem lacus imperdiet nisi auctor. Sagittis quis curabitur morbi tincidunt.",
        list: [
          "Pretium nibh ipsum consequat nisi vel pretium.",
          "Tristique nulla aliquet enim tortor at auctor urna. Sit amet aliquam id diam maecenas.",
          "Nam libero justo laoreet sit amet. Lacus sed viverra tellus in hac.",
          "Tempus imperdiet nulla malesuada pellentesque elit eget gravida cum.",
        ],
      },
      {
        subheading: "Should I adopt a cat, or a dog?",
        subtext:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Semper nulla elementum, lobortis feugiat eros rhoncus, sem est molestie. Quam nisi, purus adipiscing dictumst fringilla. Lorem lacus imperdiet nisi auctor. Sagittis quis curabitur morbi tincidunt.",
        list: [],
      },
    ],
  };

  return (
    <div className="px-auto pb-12 pt-24 px-4 sm:px-6 lg:px-32 bg-white text-black font-poppins">
      {/* Blog Image */}
      <div className="overflow-hidden rounded-lg shadow-lg">
        <img
          src={blogData.image} // Use the image from the blogData object
          alt={blogData.title}
          className="w-full h-48 sm:h-64 md:h-72 lg:h-96 object-cover"
        />
      </div>

      {/* Blog Meta Information */}
      <div className="mt-6 text-center">
        <div className="text-sm font-semibold text-gray-500">
          <span className="inline-block border border-[#FB7E46] px-3 py-1 rounded-full">
            {blogData.category}
          </span>
          <span className="ml-4">{blogData.date}</span>
        </div>
        <h1 className="mt-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold px-4 sm:px-6 lg:px-10 leading-tight text-gray-900">
          {blogData.title}
        </h1>
        <div className="mt-4 flex justify-center items-center mb-8 sm:mb-12">
          <img
            src={blogData.author.image} // Use the author image from the blogData object
            alt={blogData.author.name}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
          />
          <div className="ml-3 text-left">
            <p className="text-md sm:text-lg font-medium text-gray-700">
              {blogData.author.name}
            </p>
            <p className="text-sm text-gray-500">{blogData.author.title}</p>
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <div className="">
        {blogData.content.map((section, index) => (
          <div key={index} className="mt-8 mx-4 sm:mx-8 md:mx-16 lg:mx-36">
            {section.heading && (
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                {section.heading}
              </h2>
            )}
            {section.text && (
              <p className="text-gray-700 leading-relaxed mb-4">{section.text}</p>
            )}
            {section.list.length > 0 && (
              <ul className="ml-4 list-disc list-inside text-gray-700 mb-4">
                {section.list.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            )}
            {section.subheading && (
              <div className="mt-4">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                  {section.subheading}
                </h3>
                <p className="text-gray-700 leading-relaxed mt-2">
                  {section.subtext}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPost;
