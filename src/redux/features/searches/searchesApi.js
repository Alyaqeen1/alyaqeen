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

    // You can add these later when you implement them on backend
    // addSearch: builder.mutation({
    //   query: (searchData) => ({
    //     url: "/searches",
    //     method: "POST",
    //     body: searchData,
    //   }),
    //   invalidatesTags: ["Search"],
    // }),

    // rebuildSearch: builder.mutation({
    //   query: () => ({
    //     url: "/searches/rebuild",
    //     method: "POST",
    //   }),
    //   invalidatesTags: ["Search"],
    // }),
  }),
});

// Export hooks for use in components
export const {
  useGetAllSearchesQuery,
  usePublicSearchQuery,
  // useAddSearchMutation,  // Uncomment when needed
  // useRebuildSearchMutation,  // Uncomment when needed
} = searchesApi;
