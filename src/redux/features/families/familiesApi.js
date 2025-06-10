import { apiSlice } from "../api/apiSlice";

export const familiesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFamilies: builder.query({
      query: () => "/families",
      providesTags: ["Family"],
    }),
    getFamily: builder.query({
      query: (email) => `/families/${email}`,
      providesTags: ["Family"],
    }),
    getFullFamily: builder.query({
      query: (email) => `/families/${email}/with-children`,
      providesTags: ["Family"],
    }),
    getAllFullFamily: builder.query({
      query: (email) => `/families/${email}/with-children/all`,
      providesTags: ["Family"],
    }),
    getApprovedFullFamily: builder.query({
      query: (email) => `/families/${email}/with-children/approved`,
      providesTags: ["Family"],
    }),
  }),
});

export const {
  useGetFamiliesQuery,
  useGetFamilyQuery,
  useGetFullFamilyQuery,
  useGetAllFullFamilyQuery,
  useGetApprovedFullFamilyQuery,
} = apiSlice;
