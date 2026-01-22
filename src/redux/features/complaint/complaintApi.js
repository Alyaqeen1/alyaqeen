import { apiSlice } from "../api/apiSlice";

export const complaintApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getComplaints: builder.query({
      query: () => "/complaints",
      providesTags: ["Complaint"],
    }),
    addComplaint: builder.mutation({
      query: (complaint) => ({
        url: "/complaints",
        method: "POST",
        body: complaint,
      }),
      invalidatesTags: ["Complaint"],
    }),
  }),
});

export const { useAddComplaintMutation, useGetComplaintsQuery } = apiSlice;
