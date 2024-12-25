'use client'

import { createSlice } from '@reduxjs/toolkit';

const serviceSlice = createSlice({
  name: 'service',
  initialState: {
    selectedService: null,
    contactInfo: null,
    calendarAndSlot: null,
  },
  reducers: {
    setSelectedService: (state, action) => {
      state.selectedService = action.payload;
    },
    setContactInfo: (state, action) => {
      state.contactInfo = action.payload;
    },
    setCalendarAndSlot: (state, action) => {
      state.calendarAndSlot = action.payload;
    },
    clearBookingData: (state) => {
      state.contactInfo = null;
      state.calendarAndSlot = null;
    },
  },
});

export const { setSelectedService, setContactInfo, setCalendarAndSlot, clearBookingData } = serviceSlice.actions;
export default serviceSlice.reducer;
