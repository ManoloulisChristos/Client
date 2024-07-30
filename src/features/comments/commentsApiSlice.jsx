import { apiSlice } from '../api/apiSlice';

const commentsApiSlice = apiSlice.injectEndpoints({
  tagTypes: ['comment'],
  endpoints: (build) => ({
    getUserComments: build.query({
      query: ({ userId }) => `/comment/user/${userId}`,
      providesTags: ['comment'],
    }),
    getComments: build.query({
      query: ({ movieId, page, userId }) => {
        // If no userId is provided just ommit it
        const request = userId
          ? `/comment/${movieId}?page=${page}&userId=${userId}`
          : `/comment/${movieId}?page=${page}`;
        return request;
      },
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
        url: `/comment`,
        method: 'POST',
        body: {
          userId,
          movieId,
          name,
          text,
        },
      }),
      invalidatesTags: ['comment'],
    }),
    updateComment: build.mutation({
      query: ({ id, text }) => ({
        url: `/comment`,
        method: 'PATCH',
        body: {
          id,
          text,
        },
      }),
      invalidatesTags: ['comment'],
    }),
    deleteComment: build.mutation({
      query: ({ id }) => ({
        url: `/comment`,
        method: 'DELETE',
        body: {
          id,
        },
      }),
      invalidatesTags: ['comment'],
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
