import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 0,
};

const financialSlice = createSlice({
  name: "financial",
  initialState,
});

export default financialSlice.reducer;
