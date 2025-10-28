import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials, setCredentialsError } from '../auth/authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://moovies-api-y9r9t.ondigitalocean.app/',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (
    result?.error?.data?.error === 'TokenExpiredError' &&
    api.endpoint !== 'refresh'
  ) {
    // Access token expired. Hit refresh endpoint and get a new token.
    const refreshResult = await baseQuery('/auth/refresh', api, extraOptions);

    if (refreshResult?.data) {
      // Store access token and retry original request
      api.dispatch(setCredentials(refreshResult.data));
      result = await baseQuery(args, api, extraOptions);
    } else {
      if (result?.error?.data?.error === 'TokenExpiredError') {
        // Refresh token expired
        api.dispatch(
          setCredentialsError('Your session has expired. Please sign in again.')
        );
        refreshResult.error.data.message =
          'Your session has expired. Please sign in again.';
      } else {
        // Refresh token error
        api.dispatch(
          setCredentialsError('Credentials are missing. Please sign in again.')
        );
        refreshResult.error.data.message =
          'Credentials are missing. Please sign in again.';
      }
      return refreshResult;
    }
  } else if (result?.error?.data?.error === 'JsonWebTokenError') {
    // Access token error
    api.dispatch(
      setCredentialsError('Credentials are missing. Please sign in again.')
    );
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  endpoints: (build) => ({
    autocomplete: build.query({
      query: (term) => `/search?term=${term}`,
    }),
  }),
});

export const { useAutocompleteQuery } = apiSlice;
