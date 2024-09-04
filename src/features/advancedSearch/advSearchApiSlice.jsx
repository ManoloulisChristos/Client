import { apiSlice } from '../api/apiSlice';

const advSearchApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getFilteredMovies: build.query({
      query: ({ endpointString }) => `search/advanced?${endpointString}`,
    }),
  }),
});

export const { useGetFilteredMoviesQuery } = advSearchApiSlice;
