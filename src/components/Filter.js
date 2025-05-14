'use client'
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const FilterComponent = ({ onFilter, products }) => {
  const [selectedSubcategories, setSelectedSubcategories] = useState({});
  const [selectedBrands, setSelectedBrands] = useState({});
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortDirection, setSortDirection] = useState(''); // 'asc' or 'desc' or ''
  const [isNearbyActive, setIsNearbyActive] = useState(false);
  const [userCity, setUserCity] = useState('');
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  // Handle detecting user's location
  const getUserLocation = async () => {
    setIsLocationLoading(true);
    try {
      if (!navigator.geolocation) {
        toast.error("Geolocation is not supported by your browser");
        return;
      }

      // Get current position
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;
      
      // Use reverse geocoding to get the city
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&accept-language=en`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch location data');
      }
      
      const data = await response.json();
      
      // Extract city from response
      const city = data.address.city || 
                  data.address.town || 
                  data.address.village || 
                  data.address.county || 
                  '';
                  
      setUserCity(city);
      
      // Toggle nearby filter
      const newNearbyState = !isNearbyActive;
      setIsNearbyActive(newNearbyState);
      
      // Apply the filter
      applyFilters(newNearbyState, city);
    } catch (error) {
      console.error("Error getting location:", error);
      toast.error("Could not detect your location. Please try again.");
    } finally {
      setIsLocationLoading(false);
    }
  };
  
  // Apply all filters including nearby if active
  const applyFilters = (nearbyActive = isNearbyActive, city = userCity) => {
    const filters = {
      subcategories: Object.keys(selectedSubcategories).filter((key) => selectedSubcategories[key]),
      brands: Object.keys(selectedBrands).filter((key) => selectedBrands[key]),
      min: minPrice,
      max: maxPrice,
      sortDirection,
      isNearby: nearbyActive,
      userCity: city
    };
    onFilter(filters);
  };

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

  const handleSortChange = (direction) => {
    const newDirection = sortDirection === direction ? '' : direction;
    setSortDirection(newDirection);
    
    // Apply filter immediately
    const filters = {
      subcategories: Object.keys(selectedSubcategories).filter((key) => selectedSubcategories[key]),
      brands: Object.keys(selectedBrands).filter((key) => selectedBrands[key]),
      min: minPrice,
      max: maxPrice,
      sortDirection: newDirection,
      isNearby: isNearbyActive,
      userCity: userCity
    };
    onFilter(filters);
  };

  const handleFilter = () => {
    applyFilters();
    setIsFilterOpen(false); // Close the filter panel
  };

  const handleClearFilter = () => {
    setSelectedSubcategories({});
    setSelectedBrands({});
    setMinPrice('');
    setMaxPrice('');
    setSortDirection('');
    setIsNearbyActive(false);
    setUserCity('');
    onFilter({ subcategories: [], brands: [], min: '', max: '', sortDirection: '', isNearby: false, userCity: '' });
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
          
          {/* Nearby Button */}
          <div className="mb-6">
            <h3 className="text-lg mb-2">Location</h3>
            <button 
              onClick={getUserLocation} 
              disabled={isLocationLoading}
              className={`w-full rounded-lg px-3 py-2 border ${isNearbyActive ? 'bg-[#4D413E] text-white' : 'border-[#C49A8C]'}`}
            >
              {isLocationLoading ? 'Detecting Location...' : isNearbyActive ? 'Show All Products' : 'Show Nearby Products'}
            </button>
            {userCity && isNearbyActive && (
              <p className="text-sm mt-2">Showing products near: {userCity}</p>
            )}
          </div>
          
          {/* Sorting Section */}
          <div className="mb-6">
            <h3 className="text-lg mb-2">Sort by Price</h3>
            <div className="flex flex-col space-y-2">
              <button 
                onClick={() => handleSortChange('desc')} 
                className={`rounded-lg px-3 py-1.5 border ${sortDirection === 'desc' ? 'bg-[#4D413E] text-white' : 'border-[#C49A8C]'}`}
              >
                High to Low
              </button>
              <button 
                onClick={() => handleSortChange('asc')} 
                className={`rounded-lg px-3 py-1.5 border ${sortDirection === 'asc' ? 'bg-[#4D413E] text-white' : 'border-[#C49A8C]'}`}
              >
                Low to High
              </button>
            </div>
          </div>
          
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