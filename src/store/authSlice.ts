import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isVerified: boolean;
  isActive: boolean;
}

export interface AuthData {
  user: User;
  accessToken: string;
  tokenType: "Bearer";
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: AuthData;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: User;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
}

// Initialize state from localStorage
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
