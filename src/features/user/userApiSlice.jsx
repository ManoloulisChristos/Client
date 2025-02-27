import { redirect } from 'react-router';
import { apiSlice } from '../api/apiSlice';
import { clearCredentials } from '../auth/authSlice';
import { createToast } from '../toast/toastsSlice';

const userApiSlice = apiSlice.injectEndpoints({
  tagTypes: ['user'],
  endpoints: (builder) => ({
    getUser: builder.query({
      query: ({ id }) => `/user/${id}/settings`,
      providesTags: ['user'],
    }),
    updateUsername: builder.mutation({
      query: ({ id, username }) => ({
        url: `/user/${id}/settings/username`,
        method: 'PATCH',
        body: { username },
      }),
      invalidatesTags: ['user'],
    }),
    updatePassword: builder.mutation({
      query: ({ id, password, newPassword }) => ({
        url: `/user/${id}/settings/password`,
        method: 'PATCH',
        body: { password, newPassword },
      }),
      invalidatesTags: ['user'],
    }),
    deleteAccount: builder.mutation({
      query: ({ id, password }) => ({
        url: `/user/${id}/settings/delete`,
        method: 'DELETE',
        body: { password },
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(clearCredentials());
          dispatch(apiSlice.util.resetApiState());
          dispatch(createToast('success', 'Account deleted'));
        } catch (err) {
          dispatch(createToast('error', `${err.data.message}`));
        }
      },
    }),
  }),
});

export const {
  useGetUserQuery,
  useUpdateUsernameMutation,
  useUpdatePasswordMutation,
  useDeleteAccountMutation,
} = userApiSlice;
