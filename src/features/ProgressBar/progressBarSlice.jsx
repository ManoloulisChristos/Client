import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  size: 0,
  loaded: 0,
  isLoading: false,
};

const progressBarSlice = createSlice({
  name: 'progressBar',
  initialState,
  reducers: {
    sizeValue(state, action) {
      const size = action.payload;
      state.size = size;
    },
    loadValue(state, action) {
      const loaded = action.payload;
      state.loaded = loaded;
      if (!state.isLoading) state.isLoading = true;
    },
    reset(state, action) {
      state.size = 0;
      state.loaded = 0;
    },
    notLoading(state, action) {
      state.isLoading = false;
    },
  },
});

export const { sizeValue, loadValue, reset, notLoading } =
  progressBarSlice.actions;

export default progressBarSlice.reducer;
