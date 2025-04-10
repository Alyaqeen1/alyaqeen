import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 0,
};

const classroomSlice = createSlice({
  name: "classroom",
  initialState,
});

export default classroomSlice.reducer;
