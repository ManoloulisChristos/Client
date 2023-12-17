import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  menuButtonValue: 'Default',
  sortButtonPressed: false,
  view: 0,
  persist: false,
};
const menuButtonOptions = ['Default', 'A-Z', 'Rating', 'Runtime', 'Year'];

const moviesToolbarSlice = createSlice({
  name: 'moviesToolbar',
  initialState,
  reducers: {
    updateMenuButtonValue(state, action) {
      const option = action.payload;
      if (menuButtonOptions.includes(option)) state.menuButtonValue = option;
    },
    updateSortButtonPressed(state, action) {
      const sort = action.payload;
      if (typeof sort === 'boolean') {
        state.sortButtonPressed = !sort;
      }
    },
    updateView(state, action) {
      const btn = action.payload;
      if (btn === 0 || btn === 1) {
        state.view = btn;
      }
    },
    updatePersist(state, action) {
      const persist = action.payload;
      if (typeof persist === 'boolean') {
        state.persist = action.payload;
      }
    },
    resetMoviesToolbar(state, action) {
      state.menuButtonValue = 'Default';
      state.sortButtonPressed = false;
      state.radioButtonChecked = 0;
      state.persist = false;
    },
  },
});

export const { updateView } = moviesToolbarSlice.actions;

export default moviesToolbarSlice.reducer;
