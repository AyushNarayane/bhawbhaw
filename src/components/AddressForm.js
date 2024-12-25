import React from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

const AddressForm = ({ formData, setFormData, formVisible, setFormVisible, onSubmit }) => {
  return (
    formVisible && (
      <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-10">
        <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md">
          <h2 className="text-lg font-bold mb-4">
            {formData.id ? "Edit Address" : "Add a New Address"}
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit(); // Call the passed onSubmit function
            }}
            className="space-y-4"
          >
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="flex-grow p-2 border rounded-md"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="flex-grow p-2 border rounded-md"
              />
            </div>

            {/* Google Places Autocomplete */}
            <GooglePlacesAutocomplete
              apiKey="YOUR_GOOGLE_API_KEY" // Provide your actual Google API Key here
              selectProps={{
                value: formData.address,
                onChange: (selectedAddress) => {
                  const { label, value } = selectedAddress;
                  setFormData({
                    ...formData,
                    address: label,
                    latitude: value.geometry.location.lat(),
                    longitude: value.geometry.location.lng(),
                    city: "", // Optionally, extract more info from the selected address
                    state: "", // Optionally, extract more info from the selected address
                    postalCode: "", // Optionally, extract more info from the selected address
                  });
                },
              }}
            />

            <div className="text-right space-x-2">
              <button
                onClick={() => setFormVisible(false)}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default AddressForm;
