import { apiSlice } from "../api/apiSlice";

export const meritsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMerits: builder.query({
      query: () => "/merits",
      providesTags: ["Merit"],
    }),

    getMeritsOfStudent: builder.query({
      query: ({ studentId, month, year }) => {
        const params = new URLSearchParams();
        if (month) params.append("month", month);
        if (year) params.append("year", year);

        return `/merits/student/${studentId}?${params.toString()}`;
      },
      providesTags: (result, error, { studentId }) => [
        { type: "Merit", id: studentId },
        "Merit",
      ],
    }),
    getAllMeritsOfStudent: builder.query({
      query: (studentId) => `/merits/student/${studentId}/all`,
      providesTags: (result, error, studentId) => [
        { type: "Merit", id: studentId },
      ],
    }),
    getTopMerits: builder.query({
      query: (arg) => {
        // Case 1: No argument — default (merit only)
        if (!arg) {
          return "/merits/top-merit-students";
        }

        // Case 2: String argument — search term
        if (typeof arg === "string") {
          return arg.trim()
            ? `/merits/top-merit-students?search=${encodeURIComponent(arg.trim())}`
            : "/merits/top-merit-students";
        }

        // Case 3: Object argument — category filter
        if (typeof arg === "object" && arg.category) {
          return `/merits/top-merit-students?category=${arg.category}`;
        }

        // Fallback
        return "/merits/top-merit-students";
      },
      providesTags: ["Merit"],
    }),
    addMerit: builder.mutation({
      query: (merit) => ({
        url: "/merits",
        method: "POST",
        body: merit,
      }),
      invalidatesTags: ["Merit"],
    }),
  }),
});

export const {
  useGetMeritsQuery,
  useGetMeritsOfStudentQuery,
  useGetAllMeritsOfStudentQuery, // ← add
  useGetTopMeritsQuery,
  useAddMeritMutation,
} = meritsApi;
