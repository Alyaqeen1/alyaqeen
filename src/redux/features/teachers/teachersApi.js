import { apiSlice } from "../api/apiSlice";

export const teachersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTeachers: builder.query({
      query: () => "/teachers",
      providesTags: ["Teacher"],
    }),
    getTeacherById: builder.query({
      query: (id) => `/teachers/by-id/${id}`,
      providesTags: ["Teacher"],
    }),
    getTeacherByStatus: builder.query({
      query: (status) => `/teachers/by-status/${status}`,
      providesTags: ["Teacher"],
    }),
    getPendingRejectedTeacher: builder.query({
      query: () => `/teachers/pending-rejected`,
      providesTags: ["Teacher"],
    }),
    addTeacher: builder.mutation({
      query: (teacher) => ({
        url: "/teachers",
        method: "POST",
        body: teacher,
      }),
      invalidatesTags: ["Teacher"],
    }),
    deleteTeacher: builder.mutation({
      query: (id) => ({
        url: `/teachers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Teacher"],
    }),
    updateTeacherStatus: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/teachers/${id}`,
        method: "PATCH",
        body: patch,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Teacher"],
    }),
    updateTeacher: builder.mutation({
      query: ({ id, teacherData }) => ({
        url: `/teachers/${id}`,
        method: "PUT",
        body: teacherData,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Teacher"],
    }),
  }),
});

export const {
  useGetTeachersQuery,
  useGetTeacherByIdQuery,
  useGetTeacherByStatusQuery,
  useGetPendingRejectedTeacherQuery,
  useAddTeacherMutation,
  useUpdateTeacherStatusMutation,
  useUpdateTeacherMutation,
  useDeleteTeacherMutation,
} = apiSlice;
