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
    // ✅ ADMIN: Get all Direct Debit families
    getAdminDirectDebitFamilies: builder.query({
      query: () => "/families/admin/direct-debit-families-with-fees",
      providesTags: ["Family"],
    }),

    // ✅ ADMIN: Get specific Direct Debit family details
    getAdminDirectDebitFamily: builder.query({
      query: (id) => `/families/admin/direct-debit-family/${id}`,
      providesTags: (result, error, id) => [{ type: "Family", id }, "Family"],
    }),
    // In familiesApi.js - fix the getFamilyDebit query
    getFamilyDebit: builder.query({
      query: (familyId) =>
        `/families/check-direct-debit-setup?familyId=${familyId}`,
      providesTags: (result, error, familyId) => [
        { type: "Family", id: familyId },
        "Family",
      ],
      // ✅ ADD TRANSFORM RESPONSE to ensure correct structure
      transformResponse: (response) => {
        // Make sure the response has hasDirectDebit field
        return {
          hasDirectDebit:
            response.hasDirectDebit !== undefined
              ? response.hasDirectDebit
              : response.directDebit &&
                response.directDebit.status === "active",
          directDebit: response.directDebit || null,
        };
      },
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
    // ✅ ADMIN: Manual payment collection
    collectAdminPayment: builder.mutation({
      query: ({ familyId, amount, description }) => ({
        url: "/families/admin/collect-payment",
        method: "POST",
        body: { familyId, amount, description },
      }),
      invalidatesTags: (result, error, { familyId }) => [
        { type: "Family", id: familyId },
        "Fee", // Invalidate fees since we're collecting payment
        "Family",
      ],
    }),
    // ✅ FIXED: Check ALL pending payments (no parameters needed)
    checkPayment: builder.mutation({
      query: () => ({
        url: "/families/refresh-all-pending-payments",
        method: "POST",
        // No body needed since it checks ALL pending payments
      }),
      invalidatesTags: ["Family", "Fee"], // Invalidate both families and fees
    }),
    cancelFamilyDebit: builder.mutation({
      query: (familyId) => ({
        url: `/families/cancel-direct-debit`,
        method: "PATCH",
        body: { familyId: familyId }, // ✅ Add body with familyId
      }),
      invalidatesTags: (result, error, familyId) => [
        { type: "Family", id: familyId }, // ✅ Invalidate specific family
        "Family", // ✅ Invalidate all family queries
      ],
    }),
    // In your familiesApi.js - fix the migrateFamilyData mutation
    migrateFamilyData: builder.mutation({
      query: ({ familyId, email, password }) => ({
        url: `/families/admin/migrate-family/${familyId}`,
        method: "POST",
        body: { email, password }, // Send email and password in body
      }),
      invalidatesTags: ["Family", "Fee"],
    }),
  }),
});

export const {
  useGetFamiliesQuery,
  useGetFamilyQuery,
  useGetFullFamilyQuery,
  useGetFamilyDebitQuery,
  useGetEnrolledFullFamilyQuery,
  useGetEnrolledFullFamilyByIdQuery,
  useGetEnrolledFullFamilyWithFeesQuery,
  useGetUnpaidFamilyQuery,
  useGetAllFullFamilyQuery,
  useGetApprovedFullFamilyQuery,
  useGetHoldFullFamilyQuery,
  useUpdateFamilyDataMutation,
  useUpdateFamilyFeeChoiceMutation,
  useCancelFamilyDebitMutation,
  useDeleteFamilyDataMutation,
  useGetAdminDirectDebitFamiliesQuery,
  useGetAdminDirectDebitFamilyQuery,
  useCheckPaymentMutation,
  useCollectAdminPaymentMutation,
  useMigrateFamilyDataMutation,
} = apiSlice;
