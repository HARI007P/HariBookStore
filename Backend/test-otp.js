// Test OTP functionality directly
import dotenv from "dotenv";
import axios from "axios";

// Load environment variables
dotenv.config();

console.log("🔍 Testing OTP endpoint...");

const testData = {
  email: "hari07102004p@gmail.com", // Use the actual email address
  fullname: "Test User",
  password: "testpass123"
};

async function testOTPEndpoint() {
  try {
    console.log("📧 Sending OTP request to backend...");
    console.log("Test data:", testData);
    
    const response = await axios.post('http://localhost:4000/api/otp/send', testData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log("✅ OTP request successful!");
    console.log("Response:", response.data);
    
  } catch (error) {
    console.error("❌ OTP request failed:");
    
    if (error.response) {
      // Server responded with error status
      console.error("Status:", error.response.status);
      console.error("Response data:", error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error("No response received:", error.request);
    } else {
      // Error in setting up the request
      console.error("Request setup error:", error.message);
    }
  }
}

testOTPEndpoint();