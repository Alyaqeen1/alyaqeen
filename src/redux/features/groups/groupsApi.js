import { apiSlice } from "../api/apiSlice";

export const groupsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGroups: builder.query({
      query: () => "/groups",
      providesTags: ["Group"],
    }),
    getGroup: builder.query({
      query: (id) => `/groups/${id}`,
      providesTags: ["Group"],
    }),
    getGroupByParams: builder.query({
      query: ({ dept_id, class_id, session, time }) =>
        `/groups/find-one?dept_id=${dept_id}&class_id=${class_id}&session=${session}&time=${time}`,
      providesTags: ["Group"],
    }),

    addGroup: builder.mutation({
      query: (groupData) => ({
        url: "/groups",
        method: "POST",
        body: groupData,
      }),
      invalidatesTags: ["Group"],
    }),
  }),
});

export const {
  useGetGroupsQuery,
  useGetGroupByParamsQuery,
  useGetGroupQuery,
  useAddGroupMutation,
} = apiSlice;
