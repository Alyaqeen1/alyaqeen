import { apiSlice } from "../api/apiSlice";

export const productsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => "/api/products?madrasha_id=2",
    }),
  }),
});

export const { useGetProductsQuery } = apiSlice;
