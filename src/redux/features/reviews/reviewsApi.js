import { apiSlice } from "../api/apiSlice";

export const reviewsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReviews: builder.query({
      query: () => "/api/reviews?madrasha_id=2",
      providesTags: ["Reviews"],
    }),
    addReview: builder.mutation({
      query: (review) => ({
        url: "/api/review",
        method: "POST",
        body: review,
      }),
      invalidatesTags: ["Reviews"],
    }),
  }),
});

export const { useGetReviewsQuery, useAddReviewMutation } = apiSlice;
