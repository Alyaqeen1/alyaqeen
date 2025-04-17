import { apiSlice } from "../api/apiSlice";

export const newsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNews: builder.query({
      query: () => "/api/news_events?madrasha_id=2",
    }),
  }),
});

export const { useGetNewsQuery } = apiSlice;
