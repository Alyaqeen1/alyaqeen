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
    removeComplaint: builder.mutation({
      query: (id) => ({
        url: `/complaints/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Complaint"],
    }),
  }),
});

export const {
  useAddComplaintMutation,
  useGetComplaintsQuery,
  useRemoveComplaintMutation,
} = apiSlice;
