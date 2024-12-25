import React, { useState } from 'react';

function FilterComponent({ onFilter }) {
  const [selectedSubcategories, setSelectedSubcategories] = useState({});
  const [selectedBrands, setSelectedBrands] = useState({});

  const handleSubcategoryChange = (option) => {
    setSelectedSubcategories((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Handle the filter button click
  const handleFilter = () => {
    onFilter({ min: minPrice, max: maxPrice });
  };
  const handleBrandChange = (option) => {
    setSelectedBrands((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  return (
    <div className="bg-white px-10 py-6 rounded-[2rem] h-full shadow-2xl w-1/4 font-poppins text-[#4D413E]">
      <h2 className="text-2xl mb-4">Filters</h2>
      
      {/* Subcategory Section */}
      <div className="mb-6">
        <h3 className="text-lg mb-2">Subcategory</h3>
        {['Dry Food', 'Wet Food', 'Milk for puppies'].map((item) => (
          <div key={item} className="flex items-center mb-2">
            {selectedSubcategories[item] ? (
              <img src="images/about/paw.png" alt="icon" className="w-4 h-4 mr-2" />
            ) : (
              <input
                type="checkbox"
                checked={!!selectedSubcategories[item]}
                onChange={() => handleSubcategoryChange(item)}
                className="form-checkbox text-pink-500 mr-2 border-[#C49A8C] rounded"
                style={{
                  backgroundColor: selectedSubcategories[item] ? '#F3EAE7' : '#F3EAE7',
                }}
              />
            )}
            <label>{item}</label>
          </div>
        ))}
      </div>

      {/* Brands Section */}
      <div className="mb-6">
        <h3 className="text-lg mb-2">Brands</h3>
        {['Select', 'Orijen', 'Darling', 'Pro Plan', 'N & D', 'Acana'].map((brand) => (
          <div key={brand} className="flex items-center mb-2">
            {selectedBrands[brand] ? (
              <img src="images/about/paw.png" alt="icon" className="w-4 h-4 mr-2" />
            ) : (
              <input
                type="checkbox"
                checked={!!selectedBrands[brand]}
                onChange={() => handleBrandChange(brand)}
                className="form-checkbox mr-2 text-pink-500 border-[#C49A8C] rounded"
                style={{
                  backgroundColor: selectedBrands[brand] ? '#F3EAE7' : '#F3EAE7',
                }}
              />
            )}
            <label>{brand}</label>
          </div>
        ))}
      </div>

      {/* Updated HR */}
      <hr
        className="my-4 mx-5"
        style={{
          height: '0.1rem',
          backgroundColor: '#D9D9D9',
          display: 'block', // Ensures visibility on smaller screens
        }}
      />

      {/* Price Section */}
      <div className="mb-6">
        <h3 className="text-lg mb-2">Price</h3>
        {/* <div
  className="absolute bg-[#F3EAE7] border border-[#C9ABA0] opacity-0 w-[79px] h-[28px] top-[1300px] left-[135px] rounded-tl-[5px] rounded-tr-none rounded-br-none rounded-bl-none"
/> */}

<div className="flex justify-center">
  <div className="flex items-center space-x-1">
    <div className="flex flex-col">
      <label className="mr-2 text-sm">From</label>
      <input
        type="number"
        defaultValue="0"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
        className="border border-[#C49A8C] bg-[#F3EAE7] mt-2 rounded-lg text-center w-16"
      />
    </div>
    {/* Horizontal line */}
    <div
      style={{
        width: '2rem', // Adjust width as desired
        height: '1px',
        backgroundColor: 'black',
        marginTop: '1.75rem', // Aligns with input fields
      }}
    />
    <div className="flex flex-col items-start">
      <label className="mr-2 text-sm left-[236px]">Up to</label>
      <input
        type="number"
        defaultValue="600"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        className="border border-[#C49A8C] bg-[#F3EAE7] mt-2 rounded-lg text-center w-16"
      />
    </div>
  </div>
</div>
</div>


      {/* Centered Filter Button */}
      <div className="flex justify-center">
        <button onClick={handleFilter}className="w-[106px] h-[32px]  left-[170px] rounded-[30px] bg-[#4D413E] text-white px-8 text-sm py-1 ">
          Filter
        </button>
      </div>
    </div>
  );
}

export default FilterComponent;
