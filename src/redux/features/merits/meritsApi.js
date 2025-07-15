import { apiSlice } from "../api/apiSlice";

export const meritsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMerits: builder.query({
      query: () => "/merits",
      providesTags: ["Merit"],
    }),
    addMerit: builder.mutation({
      query: (merit) => ({
        url: "/merits",
        method: "POST",
        body: merit,
      }),
      invalidatesTags: ["Merit"],
    }),
  }),
});

export const { useGetMeritsQuery, useAddMeritMutation } = apiSlice;
