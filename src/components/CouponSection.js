import React from 'react';
import { ClipLoader } from 'react-spinners';

const CouponSection = ({ coupon, setCoupon, handleApplyCoupon, showCouponModal, setShowCouponModal, validatingCoupon, coupons, error }) => {
  return (
    <div className="mt-4 flex flex-col md:flex-row items-center">
      <div className="w-full flex items-center space-x-2">
        <div className="flex-1 flex items-center bg-[#F0F0F0] rounded-full p-2">
          <input
            type="text"
            className="flex-1 w-3/4 p-2 bg-[#F0F0F0] rounded-full outline-none text-sm"
            placeholder="Coupon Code"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
          />
          <button className="text-red-500 text-sm" onClick={() => setShowCouponModal(true)}>
            Browse Coupons
          </button>
          <button
            className="bg-[#E57A7A] text-white px-4 py-2 whitespace-nowrap text-[11px] rounded-full ml-2"
            onClick={handleApplyCoupon}
            disabled={validatingCoupon}
          >
            {validatingCoupon ? (
              <ClipLoader size={20} color="#fff" className="mx-10" />
            ) : (
              'Apply Coupon'
            )}
          </button>
        </div>
      </div>
      {/* Error Message */}
      {error && <span className='block ml-2 text-sm whitespace-nowrap'>{error}</span>}

      {/* Coupon Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg w-11/12 md:w-1/3 max-w-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Available Coupons</h2>
              <button className="text-red-500 font-semibold" onClick={() => setShowCouponModal(false)}>
                Close
              </button>
            </div>
            <div className="max-h-60 overflow-y-auto pr-1">
              <ul className="space-y-2">
                {coupons.length > 0 ? (
                  coupons.map(c => (
                    <li
                      key={c.createdAt}
                      className="p-3 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200"
                      onClick={() => {
                        setCoupon(c.couponTitle);
                        setShowCouponModal(false);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{c.couponTitle}</p>
                          <p className="text-xs text-gray-500 mt-0.5">Min. ₹{c.minPrice || '0'} required</p>
                        </div>
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                          {c.discount}% OFF
                        </span>
                      </div>
                      {c.description && (
                        <p className="text-sm text-gray-600 mt-1">{c.description}</p>
                      )}
                    </li>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No coupons available.</p>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponSection;
