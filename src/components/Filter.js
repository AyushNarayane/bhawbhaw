'use client'
import { useState } from "react";

const FilterComponent = ({ onFilter, products }) => {
  const [selectedSubcategories, setSelectedSubcategories] = useState({});
  const [selectedBrands, setSelectedBrands] = useState({});
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSubcategoryChange = (option) => {
    setSelectedSubcategories((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  const handleBrandChange = (option) => {
    setSelectedBrands((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  const handleFilter = () => {
    const filters = {
      subcategories: Object.keys(selectedSubcategories).filter((key) => selectedSubcategories[key]),
      brands: Object.keys(selectedBrands).filter((key) => selectedBrands[key]),
      min: minPrice,
      max: maxPrice,
    };
    onFilter(filters); // Pass all filters to the parent
    setIsFilterOpen(false); // Close the filter panel
  };

  const handleClearFilter = () => {
    setSelectedSubcategories({});
    setSelectedBrands({});
    setMinPrice('');
    setMaxPrice('');
    onFilter({ subcategories: [], brands: [], min: '', max: '' });
    setIsFilterOpen(false); // Close the filter panel
  };

  const uniqueSubcategories = [...new Set(products.map((product) => product.subCategory))];
  const uniqueBrands = [...new Set(products.map((product) => product.brand || 'Unknown'))]; // Handle missing brands

  return (
    <div className="relative">
      {/* Filter Button for Mobile */}
      <button
        onClick={() => setIsFilterOpen(true)}
        className="lg:hidden fixed bottom-4 left-4 p-3 rounded-full bg-[#4D413E] text-white shadow-lg z-50"
      >
        Filters
      </button>

      {/* Overlay for Mobile */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setIsFilterOpen(false)}></div>
      )}

      {/* Filter Panel */}
      <div className={`fixed lg:static top-0 left-0 w-fit h-fit rounded-xl bg-white shadow-xl max-w-xs transform lg:translate-x-0 ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 z-50 lg:z-auto`}>
        <div className="p-6 font-poppins text-[#4D413E]">
          <h2 className="text-2xl mb-4">Filters</h2>
          {/* Subcategory Section */}
          <div className="mb-6">
            <h3 className="text-lg mb-2">Subcategory</h3>
            {uniqueSubcategories.map((item) => (
              <div key={item} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={!!selectedSubcategories[item]}
                  onChange={() => handleSubcategoryChange(item)}
                  className="form-checkbox mr-2 border-[#C49A8C] rounded"
                />
                <label>{item}</label>
              </div>
            ))}
          </div>

          {/* Brands Section */}
          <div className="mb-6">
            <h3 className="text-lg mb-2">Brands</h3>
            {uniqueBrands.map((brand) => (
              <div key={brand} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={!!selectedBrands[brand]}
                  onChange={() => handleBrandChange(brand)}
                  className="form-checkbox mr-2 border-[#C49A8C] rounded"
                />
                <label>{brand}</label>
              </div>
            ))}
          </div>

          {/* Price Section */}
          <div className="mb-6">
            <h3 className="text-lg mb-2">Price</h3>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="From"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="border border-[#C49A8C] rounded-lg p-1 w-20 text-center"
              />
              <span>-</span>
              <input
                type="number"
                placeholder="To"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="border border-[#C49A8C] rounded-lg p-1 w-20 text-center"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between gap-3">
            <button
              onClick={handleFilter}
              className="flex-grow rounded-lg bg-[#4D413E] text-white px-4 py-2"
            >
              Apply
            </button>
            <button
              onClick={handleClearFilter}
              className="flex-grow rounded-lg bg-gray-300 text-black px-4 py-2"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterComponent;