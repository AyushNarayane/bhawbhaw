"use client"

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  subtotal: 0,
  total: 0,
  discountAmount: 0, // If you plan to handle discounts
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      state.items.push(item);
      // Recalculate the subtotal and total after adding an item
      state.subtotal = calculateSubtotal(state.items);
      state.total = calculateTotal(state.subtotal, state.discountAmount);
    },
    removeFromCart: (state, action) => {
      const id = action.payload.id;
      state.items = state.items.filter(item => item.id !== id);
      // Recalculate the subtotal and total after removing an item
      state.subtotal = calculateSubtotal(state.items);
      state.total = calculateTotal(state.subtotal, state.discountAmount);
    },
    clearCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.total = 0;
      state.discountAmount = 0;
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find(item => item.id === id);

      if (existingItem) {
        existingItem.quantity = quantity;
      } else {
        state.items.push({ id, quantity: quantity || 1 });
      }
      // Recalculate the subtotal and total after updating the quantity
      state.subtotal = calculateSubtotal(state.items);
      state.total = calculateTotal(state.subtotal, state.discountAmount);
    },
    setDiscount: (state, action) => {
      state.discountAmount = action.payload;
      // Recalculate the total after setting the discount
      state.total = calculateTotal(state.subtotal, state.discountAmount);
    },
  },
});

// Helper functions to calculate subtotal and total
const calculateSubtotal = (items) => {
  return items.reduce((acc, item) => acc + (item.sellingPrice * (item.quantity || 1)), 0);
};

const calculateTotal = (subtotal, discountAmount) => {
  if (!discountAmount || discountAmount === 0) {
    // No discount, so add 15 to subtotal
    return subtotal;
  }

  // If discountAmount is provided, apply the discount
  const discount = (subtotal * discountAmount) / 100;
  return subtotal - discount;
};


export const { addToCart, removeFromCart, clearCart, updateQuantity, setDiscount } = cartSlice.actions;

export default cartSlice.reducer;
