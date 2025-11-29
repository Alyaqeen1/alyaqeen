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
    getAttendanceByStudentSummary: builder.query({
      query: ({ studentId, month, year }) => {
        const params = new URLSearchParams();
        if (month) params.append("month", month);
        if (year) params.append("year", year);

        return `/attendances/student/${studentId}/summary?${params.toString()}`;
      },
      providesTags: ["Attendance"],
    }),
    // UPDATED: Added classId parameter
    getFilteredAttendances: builder.query({
      query: ({ studentIds, startDate, endDate, classId }) => {
        const params = new URLSearchParams();
        params.append("studentIds", studentIds);
        params.append("startDate", startDate);
        params.append("endDate", endDate);
        params.append("classId", classId); // Add classId to query params

        return `/attendances/filtered?${params.toString()}`;
      },
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
    // New endpoints for bulk operations
    presentAllStudents: builder.mutation({
      query: (data) => ({
        url: "/attendances/present-all",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Attendance"],
    }),

    removeAllAttendance: builder.mutation({
      query: (data) => ({
        url: "/attendances/remove-all",
        method: "DELETE",
        body: data,
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
        url: `/attendances/${id}/timeout`,
        method: "PATCH",
      }),
      invalidatesTags: ["Attendance"],
    }),
    deleteAttendance: builder.mutation({
      query: (id) => ({
        url: `/attendances/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Attendance"],
    }),
  }),
});

export const {
  useGetAttendancesQuery,
  useGetAttendanceQuery,
  useGetAttendancePresentCountQuery,
  useGetAttendanceByTeacherAndDateQuery,
  useGetFilteredAttendancesQuery, // Add this export
  usePresentAllStudentsMutation, // Add this
  useRemoveAllAttendanceMutation, // Add this
  useGetAttendanceByStudentSummaryQuery,
  useAddAttendanceMutation,
  useUpdateAttendanceMutation,
  useTimeoutAttendanceMutation,
  useDeleteAttendanceMutation,
} = attendancesApi;
