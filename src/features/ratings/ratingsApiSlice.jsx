import { apiSlice } from '../api/apiSlice';

export const ratingsApiSlice = apiSlice.injectEndpoints({
  tagTypes: ['Ratings'],
  endpoints: (build) => ({
    getRatings: build.query({
      query: ({ userId }) => `user/${userId}/rating`,
      providesTags: [{ type: 'Ratings', id: 'LIST' }],
    }),
    getPopulatedRatings: build.query({
      query: ({ userId }) => `/user/${userId}/rating/populated`,
      providesTags: [{ type: 'Ratings', id: 'LIST' }],
    }),
    addRating: build.mutation({
      query: ({ userId, movieId, rating }) => ({
        url: `user/${userId}/rating`,
        method: 'POST',
        body: { movieId, rating },
      }),
      invalidatesTags: [{ type: 'Ratings', id: 'LIST' }],
    }),
    updateRating: build.mutation({
      query: ({ userId, movieId, rating }) => ({
        url: `user/${userId}/rating`,
        method: 'PATCH',
        body: { movieId, rating },
      }),
      invalidatesTags: [{ type: 'Ratings', id: 'LIST' }],
    }),
    deleteRating: build.mutation({
      query: ({ userId, movieId }) => ({
        url: `user/${userId}/rating`,
        method: 'DELETE',
        body: { movieId },
      }),
      invalidatesTags: [{ type: 'Ratings', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetRatingsQuery,
  useGetPopulatedRatingsQuery,
  useAddRatingMutation,
  useUpdateRatingMutation,
  useDeleteRatingMutation,
} = ratingsApiSlice;
