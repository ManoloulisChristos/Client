import { apiSlice } from '../api/apiSlice';

const movieApiSlice = apiSlice.injectEndpoints({
  tagTypes: [],
  endpoints: (build) => ({
    getMovie: build.query({
      query: ({ id }) => `/search/id/${id}`,
    }),
    getMoreLikeThis: build.query({
      query: ({ id, title, plot, fullplot }) => ({
        url: `/search/more-like-this`,
        method: 'POST',
        body: {
          id,
          title,
          plot,
          fullplot,
        },
      }),
    }),
  }),
});

export const { useGetMovieQuery, useGetMoreLikeThisQuery } = movieApiSlice;
