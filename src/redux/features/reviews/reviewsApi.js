import { apiSlice } from "../api/apiSlice";

export const reviewsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReviews: builder.query({
      query: () => "/api/reviews?madrasha_id=2",
    }),
  }),
});

export const { useGetReviewsQuery } = apiSlice;
