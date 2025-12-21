import { apiSlice } from "../api/apiSlice";

export const prayer_timesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPrayerTimes: builder.query({
      query: () => "/prayer-times",
      providesTags: ["PrayerTime"],
    }),
    updatePrayerTimes: builder.mutation({
      // <-- must be mutation
      query: (time) => ({
        url: `/prayer-times/update`,
        method: "PUT",
        body: time,
      }),
      invalidatesTags: ["PrayerTime"],
    }),
  }),
});

export const {
  useGetPrayerTimesQuery,
  useUpdatePrayerTimesMutation, // <-- now this will exist
} = apiSlice;
