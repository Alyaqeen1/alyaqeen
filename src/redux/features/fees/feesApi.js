import { apiSlice } from "../api/apiSlice";

export const feesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFees: builder.query({
      query: () => `/fees`,
      providesTags: ["Fee"],
    }),
    getFee: builder.query({
      query: (id) => `/fees/${id}`,
      providesTags: ["Fee"],
    }),
    getFeesByStatus: builder.query({
      query: (status) => `/fees/by-status/${status}`,
      providesTags: ["Fee"],
    }),
    getFeesById: builder.query({
      query: (id) => `/fees/by-id/${id}`,
      providesTags: ["Fee"],
    }),
    updateFeeData: builder.mutation({
      query: ({ id, data }) => ({
        url: `/fees/update-status-mode/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Family", "Fee"], // 🔥 Important — invalidate Family when a student's status changes
    }),
    createFeeData: builder.mutation({
      query: (data) => ({
        url: `/fees`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Family", "Fee"], // 🔥 Important — invalidate Family when a student's status changes
    }),
  }),
});

export const {
  useGetFeesQuery,
  useGetFeeQuery,
  useGetFeesByStatusQuery,
  useGetFeesByIdQuery,
  useUpdateFeeDataMutation,
  useCreateFeeDataMutation,
} = apiSlice;
