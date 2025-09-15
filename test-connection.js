// test-connection.js - Test script for HariBookStore connection
const axios = require('axios');

const API_BASE_URL = 'http://localhost:4000';

async function testConnection() {
    console.log('🧪 Testing HariBookStore Backend Connection...\n');
    
    try {
        // Test 1: Basic API health check
        console.log('📡 Testing basic API connection...');
        const healthResponse = await axios.get(API_BASE_URL);
        console.log('✅ Basic API connection successful:', healthResponse.data);
        
        // Test 2: Test OTP send endpoint
        console.log('\n📧 Testing OTP send endpoint...');
        const testUser = {
            email: 'test@example.com',
            fullname: 'Test User',
            password: 'TestPass123'
        };
        
        const otpResponse = await axios.post(`${API_BASE_URL}/api/otp/send`, testUser);
        console.log('✅ OTP send endpoint working:', otpResponse.data);
        
        // Test 3: Test login endpoint (should fail gracefully for non-existent user)
        console.log('\n🔐 Testing login endpoint...');
        try {
            const loginResponse = await axios.post(`${API_BASE_URL}/api/user/login`, {
                email: 'nonexistent@example.com',
                password: 'wrongpass'
            });
            console.log('Login response:', loginResponse.data);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.log('✅ Login endpoint working (properly rejecting invalid credentials):', error.response.data);
            } else {
                throw error;
            }
        }
        
        console.log('\n🎉 All API tests passed! Your backend is working correctly.');
        console.log('\n💡 Next steps:');
        console.log('1. Open your frontend at http://localhost:3001');
        console.log('2. Try signing up with your real email address');
        console.log('3. Check your email for the OTP code');
        console.log('4. Complete the verification process');
        console.log('5. Then try logging in');
        
    } catch (error) {
        console.error('❌ Connection test failed:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.error('🚨 Backend server is not running!');
            console.error('💡 Start it with: cd Backend && node index.js');
        }
    }
}

testConnection();