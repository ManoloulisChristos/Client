import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials } from '../auth/authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:5000/api/v1',
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

  if (result?.error?.status === 403) {
    const refreshRestult = await baseQuery('/auth/refresh', api, extraOptions);

    if (refreshRestult?.data) {
      api.dispatch(setCredentials({ ...refreshRestult.data }));

      result = await baseQuery(args, api, extraOptions);
    } else {
      if (refreshRestult?.error?.status === 403) {
        refreshRestult.error.data.message = 'Your login has expired';
      }
      return refreshRestult;
    }
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
