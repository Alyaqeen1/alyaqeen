import { apiSlice } from "../api/apiSlice";

export const announcementsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAnnouncements: builder.query({
      query: () => "/announcements",
      providesTags: ["Announcements"],
    }),
    getAnnouncementByType: builder.query({
      query: (type) => `/announcements/by-type/${type}`,
      providesTags: ["Announcements"],
    }),
    // Get all public announcements (filter by type)
    getPublicAnnouncements: builder.query({
      query: () => "/announcements?type=public",
      providesTags: ["Announcements"],
    }),
    addAnnouncement: builder.mutation({
      query: (announcement) => ({
        url: "/announcements",
        method: "POST",
        body: announcement,
      }),
      invalidatesTags: ["Announcements"],
    }),
    // Update announcement by ID (for public announcements)
    updateAnnouncement: builder.mutation({
      query: ({ id, ...announcement }) => ({
        url: `/announcements/${id}`,
        method: "PUT",
        body: announcement,
      }),
      invalidatesTags: ["Announcements"],
    }),
    // Delete announcement by ID
    deleteAnnouncement: builder.mutation({
      query: (id) => ({
        url: `/announcements/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Announcements"],
    }),
  }),
});

export const {
  useGetAnnouncementsQuery,
  useGetAnnouncementByTypeQuery,
  useGetPublicAnnouncementsQuery,
  useAddAnnouncementMutation,
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation,
} = announcementsApi;
