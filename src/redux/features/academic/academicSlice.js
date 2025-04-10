import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 0,
};

const academicSlice = createSlice({
  name: "academic",
  initialState,
});

export default academicSlice.reducer;
