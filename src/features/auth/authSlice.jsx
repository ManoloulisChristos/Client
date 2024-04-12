import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: { token: null, userId: null, error: null },
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken, userIdToken } = action.payload;
      state.token = accessToken;
      state.userId = userIdToken;
      state.error = null;
    },
    clearCredentials: (state, action) => {
      state.token = null;
      state.userId = null;
    },
    setCredentialsError: (state, action) => {
      const err = action.payload;
      state.error = err;
    },
  },
});

export const { setCredentials, clearCredentials, setCredentialsError } =
  authSlice.actions;

export default authSlice.reducer;

export const selectAccessToken = (state) => state.auth.token;
export const selectUserIdToken = (state) => state.auth.userId;
export const selectTokenError = (state) => state.auth.error;
