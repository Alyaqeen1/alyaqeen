import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 0,
};

const administrationSlice = createSlice({
  name: "administration",
  initialState,
});

export default administrationSlice.reducer;
