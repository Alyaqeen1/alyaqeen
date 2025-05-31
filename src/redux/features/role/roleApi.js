import { apiSlice } from "../api/apiSlice";

export const roleApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRole: builder.query({
      query: (email) => `/users/role/${email}`,
    }),
  }),
});

export const { useGetRoleQuery } = apiSlice;
