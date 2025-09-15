import React, { createContext, useContext, useState, useEffect } from "react";
import { userService } from "../services/api";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize user from localStorage on app load
  useEffect(() => {
    try {
      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("user");

      if (token && userData) {
        setAuthUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error("Error initializing auth:", error);
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      const response = await userService.login(credentials);

      if (response.success) {
        // Save to localStorage
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));

        setAuthUser(response.user);
        return { success: true, user: response.user };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  // Signup function
  const signup = async (userData) => {
    try {
      const response = await userService.signup(userData);

      if (response.success) {
        // Save to localStorage
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));

        setAuthUser(response.user);
        return { success: true, user: response.user };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error("Signup error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Signup failed",
      };
    }
  };

  // Logout function
  const logout = () => {
    userService.logout();
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setAuthUser(null);
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem("authToken");
    return !!token && authUser !== null;
  };

  const value = {
    authUser,
    loading,
    login,
    signup,
    logout,
    isAuthenticated,
    setAuthUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Hook to use Auth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
