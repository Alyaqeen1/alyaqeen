import { apiSlice } from "../api/apiSlice";

export const departmentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDepartments: builder.query({
      query: () => "/departments",
      providesTags: ["Department"],
    }),
    getDepartment: builder.query({
      query: (id) => `/departments/${id}`,
      providesTags: ["Department"],
    }),
    addDepartment: builder.mutation({
      query: (dept) => ({
        url: "/departments",
        method: "POST",
        body: dept,
      }),
      invalidatesTags: ["Department"],
    }),
    updateDepartment: builder.mutation({
      query: ({ id, ...dept }) => ({
        url: `/departments/${id}`,
        method: "PUT",
        body: dept,
      }),
      invalidatesTags: ["Department"],
    }),
    removeDepartment: builder.mutation({
      query: (id) => ({
        url: `/departments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Department"],
    }),
  }),
});

export const {
  useGetDepartmentsQuery,
  useGetDepartmentQuery,
  useAddDepartmentMutation,
  useUpdateDepartmentMutation,
  useRemoveDepartmentMutation,
} = apiSlice;
