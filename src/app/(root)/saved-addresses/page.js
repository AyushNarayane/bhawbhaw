"use client";

import React, { useEffect, useState } from "react";
import {
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "firebaseConfig";
import { useRouter } from "next/navigation";

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
  });
  const [userId, setUserId] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [isloading, setIsloading] = useState(false)
  const router = useRouter();

  // Fetch Addresses on Mount
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));

        if (!storedUser?.userId) {
          console.error("User ID not found. Redirecting to sign-in.");
          router.push("/signin");
          return;
        }

        setUserId(storedUser.userId);

        const userRef = doc(db, "saved_addresses", storedUser.userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setAddresses(userDoc.data().addresses || []);
        } else {
          console.log("No addresses found for this user.");
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    fetchAddresses();
  }, [router]);

  // Add Address
  const handleAddAddress = async () => {
    try {
      setIsloading(true)
      if (!userId) {
        console.error("User ID is undefined.");
        return;
      }

      const userRef = doc(db, "saved_addresses", userId);
      const userDoc = await getDoc(userRef);

      const newAddress = { ...formData, id: crypto.randomUUID() };
      let updatedAddresses = [];

      if (userDoc.exists()) {
        updatedAddresses = [...(userDoc.data().addresses || []), newAddress];
      } else {
        updatedAddresses = [newAddress];
      }

      await setDoc(userRef, { addresses: updatedAddresses });
      setAddresses(updatedAddresses);
      resetForm();
    } catch (error) {
      console.error("Error adding address:", error);
    } finally {
      setIsloading(false)
    }
  };

  // Update Address
  const handleUpdateAddress = async (id) => {
    try {
      setIsloading(true)
      const userRef = doc(db, "saved_addresses", userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        console.error("User document not found.");
        return;
      }

      const updatedAddresses = (userDoc.data().addresses || []).map((addr) =>
        addr.id === id ? { ...addr, ...formData } : addr
      );

      await setDoc(userRef, { addresses: updatedAddresses });
      setAddresses(updatedAddresses);
      resetForm();
    } catch (error) {
      console.error("Error updating address:", error);
    } finally {
      setIsloading(false)
    }
  };

  // Delete Address
  const handleDeleteAddress = async (addressId) => {
    try {
      setIsloading(true)
      const userRef = doc(db, "saved_addresses", userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        console.error("User document not found.");
        return;
      }

      const updatedAddresses = (userDoc.data().addresses || []).filter(
        (addr) => addr.id !== addressId
      );

      await setDoc(userRef, { addresses: updatedAddresses });
      setAddresses(updatedAddresses);
    } catch (error) {
      console.error("Error deleting address:", error);
    } finally {
      setIsloading(false)
    }
  };

  // Reset Form
  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      address: "",
      apartment: "",
      state: "",
      city: "",
      postalCode: "",
    });
    setFormVisible(false);
  };

  return (
    <div className="flex flex-col items-center gap-5 bg-gray-50 py-10 px-4 mx-4 font-poppins">
      <div className="flex items-center w-full justify-between">
        <h1 className="text-2xl font-bold">Saved Addresses</h1>

        <button
          onClick={() => setFormVisible(true)}
          className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-xl font-semibold"
        >
          Add Address
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <p className="text-gray-700 font-medium text-center mb-4">
            No saved addresses available.
          </p>
          <button
            onClick={() => setFormVisible(true)}
            className="bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600"
          >
            Add Address
          </button>
        </div>
      ) : (
        <div className="w-full max-w-3xl space-y-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="p-4 bg-white border rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center"
            >
              <div>
                <p className="font-bold text-lg">{`${address.firstName} ${address.lastName}`}</p>
                <p className="text-sm text-gray-700">{address.address}</p>
                <p className="text-sm text-gray-700">{`${address.city}, ${address.state} ${address.postalCode}`}</p>
              </div>
              <div className="mt-2 sm:mt-0 flex space-x-2">
                <button
                  onClick={() => setFormData(address) || setFormVisible(true)}
                  className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
                  disabled={isloading}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteAddress(address.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
                  disabled={isloading}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {formVisible && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">
              {formData.id ? "Edit Address" : "Add Address"}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                formData.id
                  ? handleUpdateAddress(formData.id)
                  : handleAddAddress();
              }}
              className="space-y-4"
            >
              {["firstName", "lastName", "address", "apartment", "state", "city", "postalCode"].map(
                (field) => (
                  <input
                    key={field}
                    type="text"
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={formData[field]}
                    onChange={(e) =>
                      setFormData({ ...formData, [field]: e.target.value })
                    }
                    className="w-full px-4 py-3 border rounded-md outline-none"
                  />
                )
              )}

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => resetForm()}
                  className="px-4 py-2 bg-gray-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-500 text-white rounded-xl hover:bg-red-500"
                  disabled={isloading}
                >
                  {isloading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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


// import GooglePlacesAutocomplete from "react-google-places-autocomplete";
{/* <GooglePlacesAutocomplete
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
    /> */}