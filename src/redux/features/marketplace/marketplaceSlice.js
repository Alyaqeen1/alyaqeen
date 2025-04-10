import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 0,
};

const marketplaceSlice = createSlice({
  name: "marketplace",
  initialState,
});

export default marketplaceSlice.reducer;
