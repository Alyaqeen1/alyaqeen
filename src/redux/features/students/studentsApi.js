import { apiSlice } from "../api/apiSlice";

export const studentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query({
      query: () => "/students",
      providesTags: ["Student"],
    }),
    getStudent: builder.query({
      query: (id) => `/students/by-id/${id}`,
      providesTags: ["Student"],
    }),
    getStudentCount: builder.query({
      query: () => `/students/count`,
      providesTags: ["Student"],
    }),

    getStudentsByStatus: builder.query({
      query: (status) => `/students/get-by-status/${status}`,
      providesTags: ["Student"],
    }),
    getStudentsByEmail: builder.query({
      query: (email) => `/students/by-email/${email}`,
      providesTags: ["Student"],
    }),
    // In your studentsApi.js (or wherever your endpoints are defined)
    getStudentByActivity: builder.query({
      query: ({ activity, search }) => {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        return `/students/by-activity/${activity}?${params.toString()}`;
      },
      providesTags: ["Student"],
    }),
    getWithoutEnrolledStudents: builder.query({
      query: () => `/students/without-enrolled`,
      providesTags: ["Student"],
    }),
    getStudentsByGroup: builder.query({
      query: (groupId) => `/students/by-group/${groupId}`,
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
      invalidatesTags: ["Family", "Student"], // 🔥 Important — invalidate Family when a student's status changes
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
    updateStudentActivity: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/students/update-activity/${id}`,
        method: "PATCH",
        body: patch,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Student"],
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
  useGetStudentCountQuery,
  useGetStudentsByStatusQuery,
  useGetStudentsByEmailQuery,
  useGetStudentByActivityQuery,
  useGetStudentsByGroupQuery,
  useGetWithoutEnrolledStudentsQuery,
  useUpdateStudentStatusMutation,
  useUpdateAllStudentDataMutation,
  useUpdateStudentActivityMutation,
  useDeleteStudentDataMutation,
} = apiSlice;
