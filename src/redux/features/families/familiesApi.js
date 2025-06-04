import { apiSlice } from "../api/apiSlice";

export const familiesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFamilies: builder.query({
      query: () => "/families",
    }),
    getFamily: builder.query({
      query: (email) => `/families/${email}`,
    }),
    getFullFamily: builder.query({
      query: (email) => `/families/${email}/with-children`,
    }),
    getAllFullFamily: builder.query({
      query: (email) => `/families/${email}/with-children/all`,
    }),
  }),
});

export const {
  useGetFamiliesQuery,
  useGetFamilyQuery,
  useGetFullFamilyQuery,
  useGetAllFullFamilyQuery,
} = apiSlice;
