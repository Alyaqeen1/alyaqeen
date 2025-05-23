import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    // baseUrl: "http://35.176.169.111",
    // baseUrl: "https://talibiq.com",
    baseUrl: import.meta.env.VITE_WebApi_URL,
  }),
  tagTypes: ["Reviews"],
  endpoints: (builder) => ({}),
});
