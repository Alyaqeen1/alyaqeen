import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 0,
};

const coreSlice = createSlice({
  name: "core",
  initialState,
});

export default coreSlice.reducer;
