import { apiSlice } from "../api/apiSlice";

// In your blogsApi file
export const blogsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBlogs: builder.query({
      query: () => "/blogs",
      providesTags: ["Blog"],
    }),
    getBlog: builder.query({
      query: (id) => `/blogs/${id}`,
      providesTags: ["Blog"],
    }),
    getBlogBySlug: builder.query({
      query: (slug) => `/blogs/slug/${slug}`,
      providesTags: ["Blog"],
    }),
    getLatestBlog: builder.query({
      query: () => "/blogs/latest",
      providesTags: ["Blog"],
    }),
    createBlog: builder.mutation({
      query: (blog) => ({
        url: "/blogs",
        method: "POST",
        body: blog,
      }),
      invalidatesTags: ["Blog"],
    }),
    updateBlog: builder.mutation({
      query: ({ id, ...blog }) => ({
        url: `/blogs/${id}`,
        method: "PUT",
        body: blog,
      }),
      invalidatesTags: ["Blog"],
    }),

    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Blog"],
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useGetBlogQuery,
  useGetBlogBySlugQuery,
  useCreateBlogMutation,
  useGetLatestBlogQuery,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = apiSlice;
