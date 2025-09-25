import { apiSlice } from "../api/apiSlice";

export const familiesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFamilies: builder.query({
      query: () => "/families",
      providesTags: ["Family"],
    }),
    getFamily: builder.query({
      query: (id) => `/families/${id}`,
      providesTags: ["Family"],
    }),
    getFullFamily: builder.query({
      query: () => `/families/with-children/enrolled`,
      providesTags: ["Family"],
    }),
    getAllFullFamily: builder.query({
      query: (email) => `/families/with-children/all/${email}`,
      providesTags: ["Family"],
    }),
    getApprovedFullFamily: builder.query({
      query: (email) => `/families/with-children/approved/${email}`,
      providesTags: ["Family"],
    }),
    getEnrolledFullFamily: builder.query({
      query: (email) => `/families/with-children/enrolled/${email}`,
      providesTags: ["Family"],
    }),
    getHoldFullFamily: builder.query({
      query: () => `/families/with-children/hold`,
      providesTags: ["Family"],
    }),
    getEnrolledFullFamilyWithFees: builder.query({
      query: () => `/families/with-children/enrolled-fee-summary`,
      providesTags: ["Family"],
    }),
    getEnrolledFullFamilyById: builder.query({
      query: (id) => `/families/with-children/enrolled/by-id/${id}`,
      providesTags: ["Family"],
    }),
    getUnpaidFamily: builder.query({
      query: ({ month, year }) => `/families/unpaid-families/${month}/${year}`,
      providesTags: (result, error, { month, year }) =>
        result
          ? [
              // Specific tags for each family
              ...result.map((family) => ({
                type: "Family",
                id: family.familyId,
              })),
              // Specific tag for this month/year combination
              { type: "UnpaidFamily", id: `${month}-${year}` },
              // General tags as fallback
              "Family",
              "Fee",
            ]
          : ["Family", "Fee", { type: "UnpaidFamily", id: `${month}-${year}` }],
    }),

    updateFamilyData: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/families/update-by-admin/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: ["Family"], // 🔥 Important — invalidate Family when a student's status changes
    }),
    updateFamilyFeeChoice: builder.mutation({
      query: ({ email, ...patch }) => ({
        url: `/families/update-fee-choice/${email}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: ["Family"], // 🔥 Important — invalidate Family when a student's status changes
    }),
    deleteFamilyData: builder.mutation({
      query: (id) => ({
        url: `/families/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Family"], // 🔥 Important — invalidate Family when a student's status changes
    }),
  }),
});

export const {
  useGetFamiliesQuery,
  useGetFamilyQuery,
  useGetFullFamilyQuery,
  useGetEnrolledFullFamilyQuery,
  useGetEnrolledFullFamilyByIdQuery,
  useGetEnrolledFullFamilyWithFeesQuery,
  useGetUnpaidFamilyQuery,
  useGetAllFullFamilyQuery,
  useGetApprovedFullFamilyQuery,
  useGetHoldFullFamilyQuery,
  useUpdateFamilyDataMutation,
  useUpdateFamilyFeeChoiceMutation,
  useDeleteFamilyDataMutation,
} = apiSlice;
