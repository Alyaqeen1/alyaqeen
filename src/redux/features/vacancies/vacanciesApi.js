import { apiSlice } from "../api/apiSlice";

export const vacanciesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVacancies: builder.query({
      query: () => "/api/vacancies?madrasha_id=2",
    }),
  }),
});

export const { useGetVacanciesQuery } = apiSlice;
