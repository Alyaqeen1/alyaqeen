import { apiSlice } from "../api/apiSlice";

export const teachersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTeachers: builder.query({
      query: () => "/teachers",
    }),
    addTeacher: builder.mutation({
      query: (teacher) => ({
        url: "/teachers",
        method: "POST",
        body: teacher,
      }),
    }),
  }),
});

export const { useGetTeachersQuery, useAddTeacherMutation } = apiSlice;
