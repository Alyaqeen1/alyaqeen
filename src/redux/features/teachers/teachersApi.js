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
    getTeacherByEmail: builder.query({
      query: (email) => `/teachers/by-email/${email}`,
      providesTags: ["Teacher"],
    }),
    getTeacherByActivity: builder.query({
      query: (activity) => `/teachers/by-activity/${activity}`,
      providesTags: ["Teacher"],
    }),
    getPendingRejectedTeacher: builder.query({
      query: () => `/teachers/pending-rejected`,
      providesTags: ["Teacher"],
    }),
    getTeacherWithDetails: builder.query({
      query: (id) => `/teachers/with-details/${id}`,
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
        url: `/teachers/update-status/${id}`,
        method: "PATCH",
        body: patch,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Teacher"],
    }),
    updateTeacherActivity: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/teachers/update-activity/${id}`,
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
  useGetTeacherByEmailQuery,
  useGetTeacherByActivityQuery,
  useGetTeacherWithDetailsQuery,
  useGetPendingRejectedTeacherQuery,
  useAddTeacherMutation,
  useUpdateTeacherStatusMutation,
  useUpdateTeacherActivityMutation,
  useUpdateTeacherMutation,
  useDeleteTeacherMutation,
} = apiSlice;
