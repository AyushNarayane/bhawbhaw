"use client"

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: {
    name: "",
    email: "",
    isSubscribedToNewsletter: false
  },
  userId: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.userData = { ...state.userData, ...action.payload.userData };
      if (action.payload.userId) {
        state.userId = action.payload.userId;
      }
    },
    clearUser(state) {
      state.userData = {
        name: "",
        email: "",
      };
      state.userId = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;