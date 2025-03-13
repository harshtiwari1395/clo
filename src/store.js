// src/store.js
import { createSlice, configureStore } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  pricingFilters: [],
  searchQuery: "",
  visibleItems: 12,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setData: (state, action) => {
      state.data = action.payload;
    },
    setPricingFilters: (state, action) => {
      state.pricingFilters = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    incrementVisibleItems: (state) => {
      state.visibleItems += 8;
    },
    resetFilters: (state) => {
      state.pricingFilters = [];
      state.searchQuery = "";
    },
  },
});

export const {
  setData,
  setPricingFilters,
  setSearchQuery,
  incrementVisibleItems,
  resetFilters,
} = appSlice.actions;

export default configureStore({
  reducer: {
    app: appSlice.reducer,
  },
});
