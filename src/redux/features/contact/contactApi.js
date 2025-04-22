import { apiSlice } from "../api/apiSlice";

export const contactApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addContact: builder.mutation({
      query: (contact) => ({
        url: "/api/contact",
        method: "POST",
        body: contact,
      }),
    }),
  }),
});

export const { useAddContactMutation } = apiSlice;
