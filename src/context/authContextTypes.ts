import { createContext } from "react";

export interface User {
  id?: number;
  name?: string;
  email?: string;
  avatar?: string;
}

export interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  handleLogin: () => void;
  handleSignUp: () => void;
  handleLogout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
