import { apiSlice } from '../api/apiSlice';

const movieApiSlice = apiSlice.injectEndpoints({
  tagTypes: [],
  endpoints: (build) => ({
    getMovie: build.query({
      query: ({ id }) => `/search/id/${id}`,
    }),
  }),
});

export const { useGetMovieQuery } = movieApiSlice;
