// src/redux/features/api/searchesApi.js
import { apiSlice } from "../api/apiSlice";

export const searchesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all searchable items (for admin use)
    getAllSearches: builder.query({
      query: () => "/searches",
      providesTags: ["Search"],
    }),

    // Public search endpoint with query parameter
    publicSearch: builder.query({
      query: (searchTerm) => {
        // Don't make API call if search term is too short
        if (!searchTerm || searchTerm.length < 2) {
          return { url: "/searches/public?q=empty", skip: true };
        }
        return `/searches/public?q=${encodeURIComponent(searchTerm)}`;
      },
      // Transform the response if needed
      transformResponse: (response) => {
        // Ensure we always return an array
        return Array.isArray(response) ? response : [];
      },
      // Keep unused data for 5 minutes
      keepUnusedDataFor: 300,
      // Provide tags for cache invalidation
      providesTags: (result, error, searchTerm) =>
        result ? [{ type: "Search", id: searchTerm }] : ["Search"],
    }),

    // ===== NEW: DASHBOARD SEARCH WITH ROLE =====
    dashboardSearch: builder.query({
      query: ({ searchTerm, role }) => {
        if (!searchTerm || searchTerm.length < 2 || !role) {
          return { url: "/searches/dashboard?q=empty", skip: true };
        }
        return `/searches/dashboard?q=${encodeURIComponent(searchTerm)}&role=${role}`;
      },
      transformResponse: (response) => {
        return Array.isArray(response) ? response : [];
      },
      keepUnusedDataFor: 300,
      providesTags: (result, error, { searchTerm, role }) =>
        result
          ? [{ type: "DashboardSearch", id: `${role}-${searchTerm}` }]
          : ["DashboardSearch"],
    }),
  }),
});

// Export hooks for use in components
export const {
  useGetAllSearchesQuery,
  usePublicSearchQuery,
  useDashboardSearchQuery,
  // useAddSearchMutation,  // Uncomment when needed
  // useRebuildSearchMutation,  // Uncomment when needed
} = searchesApi;
