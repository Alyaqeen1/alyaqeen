import { apiSlice } from "../api/apiSlice";

export const subjectsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSubjects: builder.query({
      query: () => "/subjects",
      providesTags: ["Subject"],
    }),
    getSubject: builder.query({
      query: (id) => `/subjects/${id}`,
      providesTags: ["Subject"],
    }),
    addSubject: builder.mutation({
      query: (subjectData) => ({
        url: "/subjects",
        method: "POST",
        body: subjectData,
      }),
      invalidatesTags: ["Subject"],
    }),
    updateSubject: builder.mutation({
      query: ({ id, ...subjectData }) => ({
        url: `/subjects/${id}`,
        method: "PUT",
        body: subjectData,
      }),
      invalidatesTags: ["Subject"],
    }),
    removeSubject: builder.mutation({
      query: (id) => ({
        url: `/subjects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Subject"],
    }),
  }),
});

export const {
  useGetSubjectsQuery,
  useGetSubjectQuery,
  useAddSubjectMutation,
  useUpdateSubjectMutation,
  useRemoveSubjectMutation,
} = apiSlice;
