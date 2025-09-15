// src/services/api.js
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://haribookstore-backend.onrender.com", // Uses your backend API with fallback
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Book API functions
export const bookService = {
  // Get all books
  getAllBooks: async () => {
    try {
      const response = await api.get("/book");
      return response.data;
    } catch (error) {
      console.error("Error fetching books:", error);
      throw error;
    }
  },

  // Get books by category
  getBooksByCategory: async (category) => {
    try {
      const response = await api.get(`/book?category=${category}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching books for category ${category}:`, error);
      throw error;
    }
  }
};

// Export books API for easier imports
export const booksAPI = {
  getAll: bookService.getAllBooks,
  getByCategory: bookService.getBooksByCategory
};

// User API functions
export const userService = {
  // User signup
  signup: async (userData) => {
    try {
      const response = await api.post("/user/signup", userData);
      if (response.data.success && response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error("Error during signup:", error);
      throw error;
    }
  },

  // User login
  login: async (credentials) => {
    try {
      const response = await api.post("/user/login", credentials);
      if (response.data.success && response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  },

  // User logout
  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem("authToken");
  }
};

// OTP API functions for Signup
export const otpService = {
  // Send OTP for Signup (includes fullname, email, password)
  sendSignupOTP: async (signupData) => {
    try {
      const response = await api.post("/otp/send", signupData);
      return response.data;
    } catch (error) {
      console.error("Error sending signup OTP:", error);
      throw error;
    }
  },

  // Verify OTP and Complete Signup
  verifySignupOTP: async (otpData) => {
    try {
      const response = await api.post("/otp/verify", otpData);
      if (response.data.success && response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error("Error verifying OTP:", error);
      throw error;
    }
  }
};

// Payment API functions
export const paymentService = {
  // Process payment
  processPayment: async (paymentData) => {
    try {
      const response = await api.post("/payment", paymentData);
      return response.data;
    } catch (error) {
      console.error("Error processing payment:", error);
      throw error;
    }
  },

  // Get payment history
  getPaymentHistory: async () => {
    try {
      const response = await api.get("/payment/orders");
      return response.data;
    } catch (error) {
      console.error("Error fetching payment history:", error);
      throw error;
    }
  },

  // Get single order
  getOrder: async (orderId) => {
    try {
      const response = await api.get(`/payment/order/${orderId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching order:", error);
      throw error;
    }
  }
};
