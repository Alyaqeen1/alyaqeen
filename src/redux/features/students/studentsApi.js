import { apiSlice } from "../api/apiSlice";

export const studentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query({
      query: () => "/students",
    }),
    getStudent: builder.query({
      query: (id) => `/students/${id}`,
    }),
    getStudentsByStatus: builder.query({
      query: (status) => `/students/get-by-status/${status}`,
    }),
    getWithoutEnrolledStudents: builder.query({
      query: () => `/students/without-enrolled`,
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
  useGetStudentsByStatusQuery,
  useGetWithoutEnrolledStudentsQuery,
  useUpdateStudentStatusMutation,
} = apiSlice;
