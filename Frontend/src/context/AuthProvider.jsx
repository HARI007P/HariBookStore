import React, { createContext, useContext, useState, useEffect } from "react";
import { userService } from "../services/api";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on app start
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem("authToken");
        const userData = localStorage.getItem("user");
        
        if (token && userData) {
          const user = JSON.parse(userData);
          setAuthUser(user);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        // Clear invalid data
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await userService.login(credentials);
      if (response.success) {
        setAuthUser(response.user);
        return { success: true, user: response.user };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || "Login failed" 
      };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await userService.signup(userData);
      if (response.success) {
        setAuthUser(response.user);
        return { success: true, user: response.user };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error("Signup error:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || "Signup failed" 
      };
    }
  };

  const logout = () => {
    userService.logout();
    setAuthUser(null);
  };

  const isAuthenticated = () => {
    return userService.isAuthenticated() && authUser !== null;
  };

  const value = {
    authUser,
    loading,
    login,
    signup,
    logout,
    isAuthenticated,
    setAuthUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
