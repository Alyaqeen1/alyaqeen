import { apiSlice } from "../api/apiSlice";

export const classesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getClasses: builder.query({
      query: () => "/classes",
      providesTags: ["Class"],
    }),
    getClass: builder.query({
      query: (id) => `/classes/${id}`,
      providesTags: ["Class"],
    }),
    addClass: builder.mutation({
      query: (class_name) => ({
        url: "/classes",
        method: "POST",
        body: class_name,
      }),
      invalidatesTags: ["Class"],
    }),
    updateClass: builder.mutation({
      query: ({ id, ...classData }) => ({
        url: `/classes/${id}`,
        method: "PUT",
        body: classData,
      }),
      invalidatesTags: ["Class"],
    }),
    removeClass: builder.mutation({
      query: (id) => ({
        url: `/classes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Class"],
    }),
  }),
});

export const {
  useGetClassesQuery,
  useGetClassQuery,
  useAddClassMutation,
  useUpdateClassMutation,
  useRemoveClassMutation,
} = apiSlice;
