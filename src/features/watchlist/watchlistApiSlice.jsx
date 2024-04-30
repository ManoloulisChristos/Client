import { apiSlice } from '../api/apiSlice';

export const watchlistApiSlice = apiSlice.injectEndpoints({
  tagTypes: ['watchlist'],
  endpoints: (build) => ({
    getWatchlist: build.query({
      query: ({ userId }) => `user/${userId}/watchlist`,
      providesTags: ['watchlist'],
    }),

    addToWatchlist: build.mutation({
      query: ({ userId, movieId }) => ({
        url: `user/${userId}/watchlist`,
        method: 'POST',
        body: { movieId },
      }),
      invalidatesTags: ['watchlist'],
    }),
    deleteFromWatchlist: build.mutation({
      query: ({ userId, movieId }) => ({
        url: `user/${userId}/watchlist`,
        method: 'DELETE',
        body: { movieId },
      }),
      invalidatesTags: ['watchlist'],
    }),
  }),
});

export const {
  useGetWatchlistQuery,
  useAddToWatchlistMutation,
  useDeleteFromWatchlistMutation,
} = watchlistApiSlice;
