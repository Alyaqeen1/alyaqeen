import { apiSlice } from "../api/apiSlice";

export const feesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFees: builder.query({
      query: () => `/fees`,
    }),
    getFee: builder.query({
      query: (id) => `/fees/${id}`,
    }),
    getFeesByStatus: builder.query({
      query: (status) => `/fees/by-status/${status}`,
    }),
    getFeesById: builder.query({
      query: (id) => `/fees/by-id/${id}`,
    }),
  }),
});

export const {
  useGetFeesQuery,
  useGetFeeQuery,
  useGetFeesByStatusQuery,
  useGetFeesByIdQuery,
} = apiSlice;
