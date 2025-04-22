import { apiSlice } from "../api/apiSlice";

export const complaintApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addComplaint: builder.mutation({
      query: (complaint) => ({
        url: "/api/complaint",
        method: "POST",
        body: complaint,
      }),
    }),
  }),
});

export const { useAddComplaintMutation } = apiSlice;
