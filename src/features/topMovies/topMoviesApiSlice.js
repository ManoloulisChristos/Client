import { apiSlice } from '../api/apiSlice';

const topMoviesApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getTopMovies: build.query({
      query: ({ genre }) => `/search/top100?genre=${genre}`,
    }),
  }),
});

export const { useGetTopMoviesQuery } = topMoviesApiSlice;
