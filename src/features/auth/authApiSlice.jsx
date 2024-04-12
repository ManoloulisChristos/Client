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
      query: ({ id }) => ({
        url: '/auth/logout',
        method: 'POST',
        body: { id },
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

    getVerification: builder.query({
      queryFn: async ({ user, token }, api, extraOptions, baseQuery) => {
        const result = await baseQuery(
          `/auth/verification?user=${user}&token=${token}`
        );
        if (result.error) return { error: result.error };
        // Refresh the users tokens in order the isVerified property to be true
        const refresh = await baseQuery('/auth/refresh');
        if (refresh.data) {
          api.dispatch(setCredentials(refresh.data));
        }

        return { data: result.data };
      },
    }),
    sendVerificationEmail: builder.mutation({
      query: ({ id }) => ({
        url: '/auth/verification/resend',
        method: 'POST',
        body: { id },
      }),
    }),
    sendPasswordResetEmail: builder.mutation({
      query: ({ email }) => ({
        url: '/auth/password/resend',
        method: 'POST',
        body: { email },
      }),
    }),
    getPasswordValidation: builder.query({
      query: ({ user, token }) =>
        `auth/password/validation?user=${user}&token=${token}`,
      keepUnusedDataFor: 0,
    }),
    sendNewPassword: builder.mutation({
      query: ({ password, user, token }) => ({
        url: `auth/password/validation?user=${user}&token=${token}`,
        method: 'POST',
        body: { password },
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
  useSendPasswordResetEmailMutation,
  useGetPasswordValidationQuery,
  useSendNewPasswordMutation,
} = authApiSlice;
