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

    updateFamilyData: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/families/update-by-admin/${id}`,
        method: "PATCH",
        body: patch,
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
  useGetAllFullFamilyQuery,
  useGetApprovedFullFamilyQuery,
  useGetHoldFullFamilyQuery,
  useUpdateFamilyDataMutation,
} = apiSlice;
