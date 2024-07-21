import { apiSlice } from '../api/apiSlice';

const commentsApiSlice = apiSlice.injectEndpoints({
  tagTypes: [],
  endpoints: (build) => ({
    getUserComments: build.query({
      query: ({ userId }) => `/comment/user/${userId}`,
    }),
    getComments: build.query({
      query: ({ movieId, page }) => `/comment/${movieId}?page=${page}`,
      // Always the same endpoint name
      serializeQueryArgs: ({ queryArgs, endpointName }) => {
        const { movieId } = queryArgs;
        return `${endpointName}(${movieId})`;
      },
      merge: (currentCache, newItems, { arg }) => {
        // reset the state when the movie changes
        if (arg.page === 1) {
          return newItems;
        } else {
          currentCache.docs.push(...newItems.docs);
        }
      },
      forceRefetch: ({ currentArg, previousArg }) => {
        return currentArg !== previousArg;
      },
    }),
    addComment: build.mutation({
      query: ({ movieId, userId, name, text }) => ({
        url: `/comment/${movieId}`,
        method: 'POST',
        body: {
          userId,
          movieId,
          name,
          text,
        },
      }),
    }),
    updateComment: build.mutation({
      query: ({ id, movieId, text }) => ({
        url: `/comment/${movieId}`,
        method: 'PATCH',
        body: {
          id,
          text,
        },
      }),
    }),
    deleteComment: build.mutation({
      query: ({ id, movieId }) => ({
        url: `/comment/${movieId}`,
        method: 'PATCH',
        body: {
          id,
        },
      }),
    }),
  }),
});

export const {
  useGetUserCommentsQuery,
  useGetCommentsQuery,
  useAddCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = commentsApiSlice;
