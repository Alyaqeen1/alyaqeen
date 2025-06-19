import { apiSlice } from "../api/apiSlice";

export const studentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query({
      query: () => "/students",
      providesTags: ["Student"],
    }),
    getStudent: builder.query({
      query: (id) => `/students/${id}`,
      providesTags: ["Student"],
    }),
    getStudentsByStatus: builder.query({
      query: (status) => `/students/get-by-status/${status}`,
      providesTags: ["Student"],
    }),
    getWithoutEnrolledStudents: builder.query({
      query: () => `/students/without-enrolled`,
      providesTags: ["Student"],
    }),
    updateStudentStatus: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/students/${id}`,
        method: "PATCH",
        body: patch,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Family"], // 🔥 Important — invalidate Family when a student's status changes
    }),
    updateAllStudentData: builder.mutation({
      query: ({ id, studentData }) => ({
        url: `/students/${id}`,
        method: "PUT",
        body: studentData,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Family", "Student"],
    }),
    deleteStudentData: builder.mutation({
      query: (id) => ({
        url: `/students/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Family", "Student"], // 🔥 Important — invalidate Family when a student's status changes
    }),
  }),
});

export const {
  useGetStudentsQuery,
  useGetStudentQuery,
  useGetStudentsByStatusQuery,
  useGetWithoutEnrolledStudentsQuery,
  useUpdateStudentStatusMutation,
  useUpdateAllStudentDataMutation,
  useDeleteStudentDataMutation,
} = apiSlice;
