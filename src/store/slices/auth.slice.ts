import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserModel {
  readonly id: string;
  token: string;
  email: string;
  email_verified: boolean;
}

interface AuthState {
  user: UserModel | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginUser(state, action: PayloadAction<UserModel>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },

    logoutUser() {
      return initialState;
    },

    updateUser(state, action: PayloadAction<Partial<UserModel>>) {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        };
      }
    },
  },
});

export const { loginUser, logoutUser, updateUser } = authSlice.actions;
export default authSlice.reducer;
