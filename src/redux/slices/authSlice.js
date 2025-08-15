import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: '',
};
export const authConfigsSlice = createSlice({
  name: 'authConfigs',
  initialState: initialState,
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
    },

    logout(state, action) {
      state.token = '';
    },
  }, 
});

export const {setToken, logout} = authConfigsSlice.actions;

export default authConfigsSlice.reducer;