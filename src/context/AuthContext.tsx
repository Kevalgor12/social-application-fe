import { useState, type ReactNode } from "react";
import { AuthContext, type User } from "./authContextTypes";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state from localStorage using lazy initializers
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const loggedInUser = localStorage.getItem("user");
    return !!loggedInUser;
  });

  const [user, setUser] = useState<User | null>(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      try {
        return JSON.parse(loggedInUser);
      } catch {
        return null;
      }
    }
    return null;
  });

  const handleLogin = () => {
    // Simulate login
    const mockUser = {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    };
    localStorage.setItem("user", JSON.stringify(mockUser));
    setIsLoggedIn(true);
    setUser(mockUser);
  };

  const handleSignUp = () => {
    // Simulate sign up
    const mockUser = {
      id: Date.now(), // Use timestamp for unique ID
      name: "Jane Smith",
      email: "jane@example.com",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    };
    localStorage.setItem("user", JSON.stringify(mockUser));
    setIsLoggedIn(true);
    setUser(mockUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        handleLogin,
        handleSignUp,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
