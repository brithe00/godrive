import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
  },
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
    updateCurrentUser: (state, action) => {
      if (state.currentUser) {
        Object.assign(state.currentUser, action.payload);
      }
    },
  },
});

export const { setCurrentUser, clearCurrentUser, updateCurrentUser } =
  userSlice.actions;

export default userSlice.reducer;
