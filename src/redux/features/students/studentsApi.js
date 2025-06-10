import { apiSlice } from "../api/apiSlice";

export const studentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query({
      query: () => "/students",
    }),
    getStudent: builder.query({
      query: (id) => `/students/${id}`,
    }),
    updateStudentStatus: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/students/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: ["Family"], // 🔥 Important — invalidate Family when a student's status changes
    }),
  }),
});

export const {
  useGetStudentsQuery,
  useGetStudentQuery,
  useUpdateStudentStatusMutation,
} = apiSlice;
