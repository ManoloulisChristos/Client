import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  view: 'grid',
};

const moviesToolbarSlice = createSlice({
  name: 'moviesToolbar',
  initialState,
  reducers: {
    updateView(state, action) {
      const btn = action.payload;
      if (btn === 'grid' || btn === 'list') {
        state.view = btn;
      } else {
        state.view = 'grid';
      }
    },
  },
});

export const { updateView } = moviesToolbarSlice.actions;

export default moviesToolbarSlice.reducer;
