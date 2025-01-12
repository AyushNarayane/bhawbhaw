"use client";

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  subtotal: 0,
  total: 0,
  discountAmount: 0, // If you plan to handle discounts
  deliveryFee: 0,    // New state for delivery fee
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
      state.total = calculateTotal(state.subtotal, state.discountAmount, state.deliveryFee);
    },
    removeFromCart: (state, action) => {
      const id = action.payload.id;
      state.items = state.items.filter(item => item.id !== id);
      // Recalculate the subtotal and total after removing an item
      state.subtotal = calculateSubtotal(state.items);
      state.total = calculateTotal(state.subtotal, state.discountAmount, state.deliveryFee);
    },
    clearCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.total = 0;
      state.discountAmount = 0;
      state.deliveryFee = 0;
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
      state.total = calculateTotal(state.subtotal, state.discountAmount, state.deliveryFee);
    },
    setDiscount: (state, action) => {
      state.discountAmount = action.payload;
      // Recalculate the total after setting the discount
      state.total = calculateTotal(state.subtotal, state.discountAmount, state.deliveryFee);
    },
    setTotalVal: (state, action) => {
      state.total = action.payload; // Action to set total
    },
    setDeliveryFee: (state, action) => {
      state.deliveryFee = action.payload;
      // Recalculate the total after setting the delivery fee
      // state.total = calculateTotal(state.subtotal, state.discountAmount, state.deliveryFee);
    },
  },
});

// Helper functions to calculate subtotal and total
const calculateSubtotal = (items) => {
  return items.reduce((acc, item) => acc + (item.sellingPrice * (item.quantity || 1)), 0);
};

const calculateTotal = (subtotal, discountAmount, deliveryFee) => {
  let total = subtotal;

  // Apply discount if there is one
  if (discountAmount && discountAmount !== 0) {
    const discount = (subtotal * discountAmount) / 100;
    total -= discount;
  }

  // Add the delivery fee
  return total + deliveryFee;
};

export const { addToCart, removeFromCart, clearCart, updateQuantity, setDiscount, setDeliveryFee, setTotalVal } = cartSlice.actions;

export default cartSlice.reducer;
