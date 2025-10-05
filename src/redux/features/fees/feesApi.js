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
    getFeesByStudentId: builder.query({
      query: (id) => `/fees/by-student-id/${id}`,
      providesTags: ["Fee"],
    }),
    getFeesByFeeId: builder.query({
      query: (id) => `/fees/by-fee-id/${id}`,
      providesTags: ["Fee"],
    }),
    getFeesSummary: builder.query({
      query: (id) => `/fees/student-summary/${id}`,
      providesTags: ["Fee"],
    }),
    getFeesByDate: builder.query({
      query: (params = {}) => {
        const { paymentType, month, year } = params;
        let url = "/fees/with-payments";

        // Add query parameters if provided
        const queryParams = new URLSearchParams();
        if (paymentType) queryParams.append("paymentType", paymentType);
        if (month) queryParams.append("month", month);
        if (year) queryParams.append("year", year);

        if (queryParams.toString()) {
          url += `?${queryParams.toString()}`;
        }

        console.log("RTK Query URL:", url); // For debugging
        return url;
      },
      providesTags: ["Fee"],
    }),
    getUnpaidFees: builder.query({
      query: (id) => `/fees/unpaid-months/${id}`,
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
    updateFee: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/fees/update/${id}`,
        method: "PATCH",
        body, // send fields directly, not nested in 'data'
      }),
      invalidatesTags: ["Family", "Fee"],
    }),
    updatePayment: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/fees/update-payment/${id}`,
        method: "PATCH",
        body, // send fields directly, not nested in 'data'
      }),
      invalidatesTags: ["Fee"],
    }),

    createFeeData: builder.mutation({
      query: (data) => ({
        url: `/fees`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Family", "Fee"], // 🔥 Important — invalidate Family when a student's status changes
    }),
    deleteFee: builder.mutation({
      query: (id) => ({
        url: `/fees/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        "Family",
        "Fee",
        { type: "UnpaidFamily", id: "PARTIAL" }, // Invalidate all unpaid family queries
      ],
    }),
  }),
});

export const {
  useGetFeesQuery,
  useGetFeeQuery,
  useGetFeesByStatusQuery,
  useGetFeesSummaryQuery,
  useGetFeesByDateQuery,
  useGetFeesByIdQuery,
  useGetUnpaidFeesQuery,
  useGetFeesByStudentIdQuery,
  useGetFeesByFeeIdQuery,
  useUpdateFeeDataMutation,
  useUpdateFeeMutation,
  useUpdatePaymentMutation,
  useCreateFeeDataMutation,
  useDeleteFeeMutation,
} = apiSlice;
