import { apiSlice } from "../api/apiSlice";

export const notificationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => `/notifications`,
    }),
    getUnreadNotifications: builder.query({
      query: () => `/notifications/unread`,
    }),
  }),
});

export const { useGetNotificationsQuery, useGetUnreadNotificationsQuery } =
  apiSlice;
