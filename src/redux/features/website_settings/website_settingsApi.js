import { apiSlice } from "../api/apiSlice";

export const website_settingsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all website settings
    getWebsiteSettings: builder.query({
      query: () => "/website-settings",
      transformResponse: (response) => {
        // Handle both array and object responses
        if (Array.isArray(response)) {
          // If it's an array, take the first item
          return response[0] || {};
        }
        // If it's already an object with data property
        return response.data || response || {};
      },
      providesTags: ["WebsiteSettings"],
    }),

    // Update entire settings
    updateWebsiteSettings: builder.mutation({
      query: (settings) => ({
        url: "/website-settings",
        method: "PUT",
        body: settings,
      }),
      invalidatesTags: ["WebsiteSettings"],
    }),

    // Update specific section
    updateWebsiteSection: builder.mutation({
      query: ({ section, data }) => ({
        url: `/website-settings/${section}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["WebsiteSettings"],
    }),

    // Get specific section
    getWebsiteSection: builder.query({
      query: (section) => `/website-settings/${section}`,
      transformResponse: (response) => {
        return response.data || response || {};
      },
      providesTags: ["WebsiteSettings"],
    }),

    // Delete/clear specific section
    clearWebsiteSection: builder.mutation({
      query: (section) => ({
        url: `/website-settings/${section}`,
        method: "DELETE",
      }),
      invalidatesTags: ["WebsiteSettings"],
    }),
  }),
});

export const {
  useGetWebsiteSettingsQuery,
  useUpdateWebsiteSettingsMutation,
  useUpdateWebsiteSectionMutation,
  useGetWebsiteSectionQuery,
  useClearWebsiteSectionMutation,
} = website_settingsApi;
