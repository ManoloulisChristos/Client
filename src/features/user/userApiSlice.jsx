import { apiSlice } from '../api/apiSlice';

const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query({
      query: ({ id }) => `/user/${id}/settings`,
    }),
  }),
});

export const { useGetUserQuery } = userApiSlice;
