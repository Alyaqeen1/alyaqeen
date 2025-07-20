import { apiSlice } from "../api/apiSlice";

export const lessons_coveredApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLessonsCovered: builder.query({
      query: () => "/lessons-covered",
      providesTags: ["LessonsCovered"],
    }),
    // Example improved query
    getLessonsCoveredMonthlySummary: builder.query({
      query: ({ month, year }) => ({
        url: "/lessons-covered/monthly-summary",
        params: { month, year },
      }),
      providesTags: ["LessonsCovered"],
      transformResponse: (response) => response,
      transformErrorResponse: (response) => response.data,
    }),
    getTeacherLessonsCoveredMonthlySummary: builder.query({
      query: ({ id, month, year }) => {
        const query = new URLSearchParams();

        if (month) query.set("month", month);
        if (year) query.set("year", year);

        return {
          url: `/lessons-covered/teacher-monthly-summary/${id}`,
          params: query,
        };
      },
      providesTags: ["LessonsCovered"],
    }),
    getStudentLessonsCoveredMonthlySummary: builder.query({
      query: ({ student_ids = [], month, year }) => {
        const query = new URLSearchParams();

        if (student_ids.length > 0) {
          query.set("student_ids", student_ids.join(","));
        }
        if (month) query.set("month", month);
        if (year) query.set("year", year);

        return {
          url: `/lessons-covered/student-monthly-summary`,
          params: query,
        };
      },
      providesTags: ["LessonsCovered"],
    }),

    getLessonsCoveredYearlySummary: builder.query({
      query: ({ year }) => `/lessons-covered/yearly-summary?year=${year}`,
      providesTags: ["LessonsCovered"],
    }),
    getTeacherLessonsCoveredYearlySummary: builder.query({
      query: ({ id, year }) =>
        `/lessons-covered/teacher-yearly-summary/${id}?year=${year}`,
      providesTags: ["LessonsCovered"],
    }),
    getStudentLessonsCoveredYearlySummary: builder.query({
      query: ({ student_ids = [], year }) => {
        const query = new URLSearchParams();

        if (student_ids.length > 0) {
          query.set("student_ids", student_ids.join(","));
        }
        if (year) {
          query.set("year", year);
        }

        return {
          url: `/lessons-covered/student-yearly-summary`,
          params: query,
        };
      },
      providesTags: ["LessonsCovered"],
    }),
    getTeacherStudentsProgress: builder.query({
      query: ({ teacher_id, student_name, month, year }) => {
        const params = new URLSearchParams();
        if (student_name) params.append("student_name", student_name);
        if (month) params.append("month", month);
        if (year) params.append("year", year);

        return `/lessons-covered/teacher-students-progress/${teacher_id}?${params.toString()}`;
      },
      providesTags: ["LessonsCovered"],
    }),
    addLessonCovered: builder.mutation({
      query: (lessonCovered) => ({
        url: "/lessons-covered",
        method: "POST",
        body: lessonCovered,
      }),
      invalidatesTags: ["LessonsCovered"],
    }),
    updateLessonCovered: builder.mutation({
      query: ({ id, data }) => ({
        url: `/lessons-covered/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["LessonsCovered"],
    }),
    publishMultipleLessons: builder.mutation({
      query: ({ ids, monthly_publish, yearly_publish }) => ({
        url: "lessons-covered/publish-multiple",
        method: "PATCH",
        body: { ids, monthly_publish, yearly_publish },
      }),
      invalidatesTags: ["LessonsCovered"],
    }),

    deleteManyLessonCovered: builder.mutation({
      query: (ids) => ({
        url: "/lessons-covered/delete-many",
        method: "DELETE",
        body: { ids }, // 👈 correct format: { ids: [...] }
      }),
      invalidatesTags: ["LessonsCovered"],
    }),
  }),
});

export const {
  useGetLessonsCoveredQuery,
  useGetLessonsCoveredMonthlySummaryQuery,
  useGetTeacherLessonsCoveredMonthlySummaryQuery,
  useGetStudentLessonsCoveredMonthlySummaryQuery,
  useGetLessonsCoveredYearlySummaryQuery,
  useGetTeacherLessonsCoveredYearlySummaryQuery,
  useGetStudentLessonsCoveredYearlySummaryQuery,
  useGetTeacherStudentsProgressQuery,
  useAddLessonCoveredMutation,
  useUpdateLessonCoveredMutation,
  usePublishMultipleLessonsMutation,
  useDeleteManyLessonCoveredMutation,
} = apiSlice;
