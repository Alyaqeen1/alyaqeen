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
    getStudentsById: builder.query({
      query: (id) => `/students/by-id/${id}`,
      providesTags: ["Student"],
    }),
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

    // 📊 NEW: Monthly admissions (students who joined in a specific month)
    getMonthlyAdmissions: builder.query({
      query: ({ year, month }) =>
        `/students/monthly-admissions?year=${year}&month=${month}`,
      providesTags: ["Student"],
    }),

    // 📊 NEW: Monthly departures (students who became inactive in a specific month)
    getMonthlyDepartures: builder.query({
      query: ({ year, month }) =>
        `/students/monthly-departures?year=${year}&month=${month}`,
      providesTags: ["Student"],
    }),

    // 📊 NEW: Class departure statistics
    getClassDepartureStats: builder.query({
      query: ({ year, month }) =>
        `/students/class-departure-stats?year=${year}&month=${month}`,
      providesTags: ["Student"],
    }),

    // 📊 NEW: Current month stats (for dashboard overview)
    getCurrentMonthStats: builder.query({
      query: () => `/students/current-month-stats`,
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
      invalidatesTags: ["Family", "Student", "Fee"],
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
      invalidatesTags: ["Family", "Student", "Fee"],
    }),
    generateReport: builder.mutation({
      query: ({ id }) => ({
        url: `/students/generate-student-report/${id}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Family", "Student", "Fee"],
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
      invalidatesTags: ["Family", "Student", "Fee"],
    }),
    deleteStudentData: builder.mutation({
      query: (id) => ({
        url: `/students/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Family", "Student"],
    }),
  }),
});

export const {
  useGetStudentQuery,
  useGetStudentsQuery,
  useGetStudentCountQuery,
  useGetStudentsByStatusQuery,
  useGetStudentsByEmailQuery,
  useGetStudentsByIdQuery,
  useGetStudentByActivityQuery,
  useGetStudentsByGroupQuery,
  useGetWithoutEnrolledStudentsQuery,
  useGetMonthlyAdmissionsQuery,
  useGetMonthlyDeparturesQuery,
  useGetClassDepartureStatsQuery,
  useGetCurrentMonthStatsQuery,
  useUpdateStudentStatusMutation,
  useUpdateAllStudentDataMutation,
  useGenerateReportMutation,
  useUpdateStudentActivityMutation,
  useDeleteStudentDataMutation,
} = apiSlice;
