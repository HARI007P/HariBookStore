// Test script for payment API
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:4000/api';

// Test data for order creation
const testOrderData = {
  customerName: "Test Customer",
  customerEmail: "rythudipo12@gmail.com",
  mobile: "9876543210",
  village: "Test Village",
  district: "Test District",
  pincode: "123456",
  state: "Andhra Pradesh",
  bookCode: "BOOK001",
  bookName: "Test Book",
  utr: "123456789012",
  amount: 35
};

// Function to test order creation
async function testCreateOrder() {
  try {
    console.log('🧪 Testing order creation...');
    const response = await fetch(`${API_BASE}/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testOrderData)
    });
    
    const result = await response.json();
    console.log('📊 Response:', result);
    
    if (result.success) {
      console.log('✅ Order created successfully!');
      console.log('📋 Order ID:', result.orderId);
      return result.orderId;
    } else {
      console.log('❌ Order creation failed:', result.message);
    }
  } catch (error) {
    console.error('🚨 Error:', error.message);
  }
}

// Function to get all orders
async function testGetOrders() {
  try {
    console.log('\n🧪 Testing get all orders...');
    const response = await fetch(`${API_BASE}/payment/orders`);
    const result = await response.json();
    
    console.log('📊 Response:', result);
    if (result.success) {
      console.log(`✅ Found ${result.total} orders`);
    } else {
      console.log('❌ Failed to get orders:', result.message);
    }
  } catch (error) {
    console.error('🚨 Error:', error.message);
  }
}

// Function to confirm an order (simulate admin action)
async function testConfirmOrder(orderId) {
  try {
    console.log('\n🧪 Testing order confirmation...');
    const response = await fetch(`${API_BASE}/payment/confirm/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        verificationStatus: 'verified',
        adminNotes: 'Payment verified successfully'
      })
    });
    
    const result = await response.json();
    console.log('📊 Response:', result);
    
    if (result.success) {
      console.log('✅ Order confirmed successfully!');
    } else {
      console.log('❌ Order confirmation failed:', result.message);
    }
  } catch (error) {
    console.error('🚨 Error:', error.message);
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting Payment API Tests...\n');
  
  // Test 1: Create order
  const orderId = await testCreateOrder();
  
  // Test 2: Get all orders
  await testGetOrders();
  
  // Test 3: Confirm order (if created successfully)
  if (orderId) {
    await testConfirmOrder(orderId);
  }
  
  console.log('\n✅ Tests completed!');
}

// Only run if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}