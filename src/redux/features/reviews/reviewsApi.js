import { apiSlice } from "../api/apiSlice";

export const reviewsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReviews: builder.query({
      query: () => "/reviews",
      providesTags: ["Reviews"],
    }),
    addReview: builder.mutation({
      query: (review) => ({
        url: "/reviews",
        method: "POST",
        body: review,
      }),
      invalidatesTags: ["Reviews"],
    }),
  }),
});

export const { useGetReviewsQuery, useAddReviewMutation } = apiSlice;
