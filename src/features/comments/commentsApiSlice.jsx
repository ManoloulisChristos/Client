import { current } from '@reduxjs/toolkit';
import { apiSlice } from '../api/apiSlice';

const commentsApiSlice = apiSlice.injectEndpoints({
  tagTypes: ['comment'],
  endpoints: (build) => ({
    getUserComments: build.query({
      query: ({ userId, sortBy, sort }) =>
        `/comment/user/${userId}?sortBy=${sortBy}&sort=${sort}`,
      providesTags: ['comment'],
    }),
    getComments: build.query({
      query: ({ movieId, page, userId, resetCache }) => {
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
        // reset the state and always setPage to 1 when resetCache is true in the components
        if (arg.page === 1 || arg.resetCache === true) {
          return newItems;
        } else {
          currentCache.docs.push(...newItems.docs);
        }
      },
      forceRefetch: ({ currentArg, previousArg }) => {
        // refetch when specific arguments change
        return (
          currentArg?.page !== previousArg?.page ||
          currentArg?.movieId !== previousArg?.movieId ||
          currentArg?.resetCache === true
        );
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
