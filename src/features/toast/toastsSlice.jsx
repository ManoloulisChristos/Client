import { createSlice, createEntityAdapter, nanoid } from '@reduxjs/toolkit';

const toastsAdapter = createEntityAdapter();

const initialState = toastsAdapter.getInitialState();

const toastsSlice = createSlice({
  name: 'toasts',
  initialState,
  reducers: {
    createToast: {
      reducer: toastsAdapter.addOne,
      prepare(mode, text) {
        return {
          payload: {
            id: nanoid(),
            mode,
            text,
          },
        };
      },
    },
    deleteToast(state, action) {
      toastsAdapter.removeOne(state, action.payload);
    },
  },
});

export const { createToast, deleteToast } = toastsSlice.actions;

export default toastsSlice.reducer;

export const {
  selectById: selectToastById,
  selectAll: selectAllToasts,
  selectTotal: selectTotalToasts,
} = toastsAdapter.getSelectors((state) => state.toasts);
