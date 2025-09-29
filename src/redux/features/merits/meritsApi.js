import { apiSlice } from "../api/apiSlice";

export const meritsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMerits: builder.query({
      query: () => "/merits",
      providesTags: ["Merit"],
    }),
    getMeritsOfStudent: builder.query({
      query: (studentId) => `/merits/student/${studentId}`,
      providesTags: ["Merit"],
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
} = apiSlice;
