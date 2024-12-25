
import { createSlice } from '@reduxjs/toolkit';

const addressesSlice = createSlice({
  name: 'addresses',
  initialState: {
    savedAddresses: [],
  },
  reducers: {
    addAddress: (state, action) => {
      state.savedAddresses.push(action.payload);
    },
    editAddress: (state, action) => {
      const { id, updatedAddress } = action.payload;
      const index = state.savedAddresses.findIndex((addr) => addr.id === id);
      if (index !== -1) {
        state.savedAddresses[index] = { ...state.savedAddresses[index], ...updatedAddress };
      }
    },
    deleteAddress: (state, action) => {
      state.savedAddresses = state.savedAddresses.filter((addr) => addr.id !== action.payload);
    },
    loadAddresses: (state, action) => {
      state.savedAddresses = action.payload;
    },
  },
});

export const { addAddress, editAddress, deleteAddress, loadAddresses } = addressesSlice.actions;
export default addressesSlice.reducer;
