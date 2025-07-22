import { apiSlice } from "../api/apiSlice";

export const holidaysApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getHolidays: builder.query({
      query: () => "/holidays",
      providesTags: ["Holiday"],
    }),
    addHoliday: builder.mutation({
      query: (holiday) => ({
        url: "/holidays",
        method: "POST",
        body: holiday,
      }),
      invalidatesTags: ["Holiday"],
    }),
    deleteHoliday: builder.mutation({
      query: (id) => ({
        url: `/holidays/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Holiday"], // 🔥 Important — invalidate Family when a student's status changes
    }),
  }),
});

export const {
  useGetHolidaysQuery,
  useAddHolidayMutation,
  useDeleteHolidayMutation,
} = apiSlice;
