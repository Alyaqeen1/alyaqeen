import { apiSlice } from "../api/apiSlice";

export const attendancesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAttendances: builder.query({
      query: () => "/attendances",
      providesTags: ["Attendance"],
    }),
    getAttendance: builder.query({
      query: (id) => `/attendances/${id}`,
      providesTags: ["Attendance"],
    }),
    getAttendancePresentCount: builder.query({
      query: (type) => `/attendances/present-today/${type}`,
      providesTags: ["Attendance"],
    }),
    getAttendanceByTeacherAndDate: builder.query({
      query: ({ teacherId, date }) =>
        `/attendances/teacher/${teacherId}/date/${date}`,
      providesTags: ["Attendance"],
    }),
    addAttendance: builder.mutation({
      query: (attendanceData) => ({
        url: "/attendances",
        method: "POST",
        body: attendanceData,
      }),
      invalidatesTags: ["Attendance"],
    }),
    updateAttendance: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/attendances/${id}`,
        method: "PATCH",
        body: patch,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Attendance"],
    }),
    timeoutAttendance: builder.mutation({
      query: (id) => ({
        url: `/attendances/${id}/timeout`, // 👈 route matches backend
        method: "PATCH",
      }),
      invalidatesTags: ["Attendance"],
    }),
    deleteAttendance: builder.mutation({
      query: (id) => ({
        url: `/attendances/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Attendance"], // 🔥 Important — invalidate Family when a student's status changes
    }),
  }),
});

export const {
  useGetAttendancesQuery,
  useGetAttendanceQuery,
  useGetAttendancePresentCountQuery,
  useGetAttendanceByTeacherAndDateQuery,
  useAddAttendanceMutation,
  useUpdateAttendanceMutation,
  useTimeoutAttendanceMutation,
  useDeleteAttendanceMutation,
} = apiSlice;
