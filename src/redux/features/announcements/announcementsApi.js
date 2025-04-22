import { apiSlice } from "../api/apiSlice";

export const announcementsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAnnouncements: builder.query({
      query: () => "/api/announcements?madrasha_id=2",
    }),
  }),
});

export const { useGetAnnouncementsQuery } = apiSlice;
