import { apiSlice } from "../api/apiSlice";

export const studentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query({
      query: () => "/students",
    }),
    getStudent: builder.query({
      query: (id) => `/students/${id}`,
    }),
  }),
});

export const { useGetStudentsQuery, useGetStudentQuery } = apiSlice;
