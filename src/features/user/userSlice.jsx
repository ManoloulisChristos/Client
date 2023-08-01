import { apiSlice } from '../api/apiSlice';
import { createSelector } from '@reduxjs/toolkit';

export const userApiSlice = apiSlice.injectEndpoints({
  keepUnusedDataFor: 999999999,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (user) => ({
        url: '/auth/login',
        method: 'POST',
        body: user,
      }),
    }),
    register: builder.mutation({
      query: (user) => ({
        url: '/auth/register',
        method: 'POST',
        body: user,
      }),
    }),
  }),
});

export const { useLoginMutation } = userApiSlice;

export const selectUser = (state) => state.api.mutations.user;
