import React from "react";

const AddressList = ({ addresses, onEditAddress, onDeleteAddress }) => {
  return (
    <div>
      {addresses.map((address) => (
        <div
          key={address.id}
          className="p-4 bg-white border rounded-md flex flex-col sm:flex-row justify-between items-start sm:items-center"
        >
          <div>
            <p className="font-bold text-lg">{`${address.firstName} ${address.lastName}`}</p>
            <p className="text-sm text-gray-700">{address.address}</p>
            <p className="text-sm text-gray-700">{`${address.city}, ${address.state} ${address.postalCode}`}</p>
          </div>
          <div className="mt-2 sm:mt-0 flex space-x-2">
            <button
              onClick={() => onEditAddress(address)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Edit
            </button>
            <button
              onClick={() => onDeleteAddress(address.id)}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AddressList;
