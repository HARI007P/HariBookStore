// src/services/api.js
import axios from "axios";

// -------------------- AXIOS INSTANCE --------------------
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // uses .env variable
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Automatically attach token for all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// -------------------- BOOK API --------------------
export const bookService = {
  getAllBooks: async () => {
    try {
      const response = await api.get("/api/book");
      return response.data;
    } catch (error) {
      console.error("📚 getAllBooks error:", error);
      throw error;
    }
  },

  getBooksByCategory: async (category) => {
    try {
      const response = await api.get(`/api/book?category=${category}`);
      return response.data;
    } catch (error) {
      console.error("📚 getBooksByCategory error:", error);
      throw error;
    }
  },
};

export const booksAPI = {
  getAll: bookService.getAllBooks,
  getByCategory: bookService.getBooksByCategory,
};

// -------------------- USER API --------------------
export const userService = {
  signup: async (userData) => {
    try {
      const response = await api.post("/api/user/signup", userData);
      if (response.data.success && response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error("👤 signup error:", error);
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post("/api/user/login", credentials);
      if (response.data.success && response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error("👤 login error:", error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  },

  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => !!localStorage.getItem("authToken"),
};

// -------------------- OTP API --------------------
export const otpService = {
  sendSignupOTP: async (signupData) => {
    try {
      const response = await api.post("/api/otp/send", signupData);
      return response.data;
    } catch (error) {
      console.error("🔑 sendSignupOTP error:", error);
      throw error;
    }
  },

  verifySignupOTP: async (otpData) => {
    try {
      const response = await api.post("/api/otp/verify", otpData);
      if (response.data.success && response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error("🔑 verifySignupOTP error:", error);
      throw error;
    }
  },
};

// -------------------- PAYMENT API --------------------
export const paymentService = {
  processPayment: async (paymentData) => {
    try {
      const response = await api.post("/api/payment", paymentData);
      return response.data;
    } catch (error) {
      console.error("💳 processPayment error:", error);
      throw error;
    }
  },

  getPaymentHistory: async () => {
    try {
      const response = await api.get("/api/payment/orders");
      return response.data;
    } catch (error) {
      console.error("💳 getPaymentHistory error:", error);
      throw error;
    }
  },

  getOrder: async (orderId) => {
    try {
      const response = await api.get(`/api/payment/order/${orderId}`);
      return response.data;
    } catch (error) {
      console.error("💳 getOrder error:", error);
      throw error;
    }
  },
};
