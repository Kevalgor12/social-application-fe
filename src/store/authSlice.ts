import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { User } from "../interfaces/auth";

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
}

const getInitialState = (): AuthState => {
  const loggedInUser = localStorage.getItem("user");
  if (loggedInUser) {
    try {
      const user = JSON.parse(loggedInUser);
      return {
        isLoggedIn: true,
        user,
      };
    } catch {
      return {
        isLoggedIn: false,
        user: null,
      };
    }
  }
  return {
    isLoggedIn: false,
    user: null,
  };
};

const initialState: AuthState = getInitialState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.isLoggedIn = true;
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      localStorage.removeItem("user");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
