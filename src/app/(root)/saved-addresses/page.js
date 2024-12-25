"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../../../../firebaseConfig"; // Adjust path based on your folder structure
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  addAddress,
  editAddress,
  deleteAddress,
  loadAddresses,
} from "../../../redux/addressesSlice";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import Link from "next/link";

const SavedAddresses = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    state: "",
    city: "",
    postalCode: "",
    latitude: "",
    longitude: "",
  });

  const user = useSelector((state) => state.user);
  const userId = user.userData.userId; // Access userId dynamically
  const addresses = useSelector((state) => state.addresses.savedAddresses);
  const dispatch = useDispatch();

  // Fetch addresses from Firestore once on page load
  useEffect(() => {

        if (!userId) {
          console.error("User ID is undefined or null");
          return; // Exit early if userId is not available
        }
      
    const fetchAddresses = async () => {
      const addressesRef = collection(db, "saved_addresses", userId, "addresses"); // Correct path
      const querySnapshot = await getDocs(addressesRef);
      const fetchedAddresses = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      dispatch(loadAddresses(fetchedAddresses));
    };

    fetchAddresses();
  }, [dispatch, userId]);

  // Add new address to Firestore and Redux
  const handleAddAddress = async () => {
    const addressesRef = collection(db, "saved_addresses", userId, "addresses");
    const docRef = await addDoc(addressesRef, formData); // Add to the user's 'addresses' subcollection
    dispatch(addAddress({ id: docRef.id, ...formData }));
    setFormData({
      firstName: "",
      lastName: "",
      address: "",
      apartment: "",
      state: "",
      city: "",
      postalCode: "",
      latitude: "",
      longitude: "",
    });
    setFormVisible(false);
  };

  // Edit existing address
  const handleEditAddress = (address) => {
    setFormData(address);
    setFormVisible(true);
  };

  // Update address in Firestore and Redux
  const handleUpdateAddress = async () => {
    const addressRef = doc(db, "saved_addresses", userId, "addresses", formData.id);
    await updateDoc(addressRef, formData); // Update the address in the user's 'addresses' subcollection
    dispatch(editAddress(formData));
    setFormVisible(false);
  };

  // Delete address
  const handleDeleteAddress = async (id) => {
    const addressRef = doc(db, "saved_addresses", userId, "addresses", id);
    await deleteDoc(addressRef); // Delete from the user's 'addresses' subcollection
    dispatch(deleteAddress(id));
  };

  return (
    <div className="flex flex-col items-center bg-white text-black py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Saved Addresses</h1>

      {/* Address Form */}
      {formVisible && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">
              {formData.id ? "Edit Address" : "Add a New Address"}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                formData.id ? handleUpdateAddress() : handleAddAddress();
              }}
              className="space-y-4"
            >
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="flex-grow p-2 border rounded-md"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="flex-grow p-2 border rounded-md"
                />
              </div>
              <GooglePlacesAutocomplete
                apiKey="YOUR_GOOGLE_API_KEY"
                selectProps={{
                  value: formData.address,
                  onChange: (selectedAddress) => {
                    const { label, value } = selectedAddress;
                    setFormData({
                      ...formData,
                      address: label,
                      latitude: value.geometry.location.lat(),
                      longitude: value.geometry.location.lng(),
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
      )}

      {/* List of Addresses */}
      

      <div className="w-full max-w-3xl space-y-4">
      <div className="flex justify-end">
  <Link href="./checkout">
    <button className="flex items-center bg-[#E57A7A] text-white px-8 py-1 rounded-2xl">
      <p>Proceed to Checkout</p>
    </button>
  </Link>
</div>

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
                onClick={() => handleEditAddress(address)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteAddress(address.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedAddresses;
// "use client";
// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { db } from "../../../../firebaseConfig";
// import { collection, getDocs, deleteDoc, doc, addDoc, updateDoc } from "firebase/firestore";
// import { loadAddresses, deleteAddress, editAddress, addAddress } from "../../../redux/addressesSlice";
// import AddressForm from "../../../components/AddressForm";
// import AddressList from "../../../components/AddressList";

// const SavedAddresses = () => {
//   const [formVisible, setFormVisible] = useState(false);
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     address: "",
//     apartment: "",
//     state: "",
//     city: "",
//     postalCode: "",
//     latitude: "",
//     longitude: "",
//   });

//   const user = useSelector((state) => state.user);
//   const userId = user.userData.userId; // Access userId dynamically
//   const addresses = useSelector((state) => state.addresses.savedAddresses);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     if (!userId) {
//       console.error("User ID is undefined or null");
//       return;
//     }

//     const fetchAddresses = async () => {
//       const addressesRef = collection(db, "saved_addresses", userId, "addresses");
//       const querySnapshot = await getDocs(addressesRef);
//       const fetchedAddresses = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       dispatch(loadAddresses(fetchedAddresses));
//     };

//     fetchAddresses();
//   }, [dispatch, userId]);

//   const handleEditAddress = (address) => {
//     setFormData(address);
//     setFormVisible(true);
//   };

//   const handleDeleteAddress = async (id) => {
//     const addressRef = doc(db, "saved_addresses", userId, "addresses", id);
//     await deleteDoc(addressRef);
//     dispatch(deleteAddress(id));
//   };

//   const handleSubmit = async () => {
//     if (formData.id) {
//       await handleUpdateAddress();
//     } else {
//       await handleAddAddress();
//     }
//   };

//   const handleAddAddress = async () => {
//     const addressesRef = collection(db, "saved_addresses", userId, "addresses");
//     const docRef = await addDoc(addressesRef, formData);
//     dispatch(addAddress({ id: docRef.id, ...formData }));
//     resetForm();
//   };

//   const handleUpdateAddress = async () => {
//     const addressRef = doc(db, "saved_addresses", userId, "addresses", formData.id);
//     await updateDoc(addressRef, formData);
//     dispatch(editAddress(formData));
//     resetForm();
//   };

//   const resetForm = () => {
//     setFormData({
//       firstName: "",
//       lastName: "",
//       address: "",
//       apartment: "",
//       state: "",
//       city: "",
//       postalCode: "",
//       latitude: "",
//       longitude: "",
//     });
//     setFormVisible(false);
//   };

//   return (
//     <div className="flex flex-col items-center bg-gray-100 py-10 px-4">
//       <h1 className="text-2xl font-bold mb-6">Saved Addresses</h1>

//       {/* Address Form */}
//       <AddressForm
//         formData={formData}
//         setFormData={setFormData}
//         formVisible={formVisible}
//         setFormVisible={setFormVisible}
//         onSubmit={handleSubmit}
//       />

//       {/* Address List */}
//       <AddressList
//         addresses={addresses}
//         handleEditAddress={handleEditAddress}
//         handleDeleteAddress={handleDeleteAddress}
//       />
//     </div>
//   );
// };

// export default SavedAddresses;
