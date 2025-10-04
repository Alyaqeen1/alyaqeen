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

    getTopMerits: builder.query({
      query: (searchTerm) =>
        searchTerm
          ? `/merits/top-merit-students?search=${encodeURIComponent(
              searchTerm
            )}`
          : "/merits/top-merit-students",
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
  useGetTopMeritsQuery,
  useAddMeritMutation,
} = meritsApi;
