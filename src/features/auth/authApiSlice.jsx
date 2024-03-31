import { apiSlice } from '../api/apiSlice';
import { setCredentials, clearCredentials } from './authSlice';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: { ...credentials },
      }),
    }),
    register: builder.mutation({
      query: (credentials) => ({
        url: '/auth/register',
        method: 'POST',
        body: { ...credentials },
      }),
    }),
    refresh: builder.mutation({
      query: () => '/auth/refresh',
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { accessToken, userIdToken } = data;
          dispatch(setCredentials({ accessToken, userIdToken }));
        } catch (error) {
          return error;
        }
      },
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(clearCredentials());
          dispatch(apiSlice.util.resetApiState());
        } catch (err) {
          console.log(err);
        }
      },
    }),
    // ({ user, token }) =>
    //     `/auth/verification?user=${user}&token=${token}`,
    getVerification: builder.query({
      query: ({ user, token }) =>
        `/auth/verification?user=${user}&token=${token}`,
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.accessToken && data?.userIdToken) {
            const { accessToken, userIdToken } = data;
            dispatch(
              setCredentials({
                accessToken,
                userIdToken,
              })
            );
          }
        } catch (error) {
          return error;
        }
      },
      keepUnusedDataFor: 0,
    }),
    sendVerificationEmail: builder.mutation({
      query: ({ id }) => ({
        url: '/auth/verification/resend',
        method: 'POST',
        body: { id },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshMutation,
  useLogoutMutation,
  useGetVerificationQuery,
  useSendVerificationEmailMutation,
} = authApiSlice;
