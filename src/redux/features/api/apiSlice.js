import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    // baseUrl: "http://35.176.169.111",
    // baseUrl: "https://talibiq.com",
    baseUrl: import.meta.env.VITE_WebApi_URL,
    credentials: "include",
  }),
  // tagTypes: ["Reviews"],
  tagTypes: [
    "Student",
    "Family",
    "Fee",
    "Teacher",
    "Department",
    "Class",
    "Subject",
    "PrayerTime",
  ], // Add both Student & Family tags here
  endpoints: (builder) => ({}),
});
