// Simple test to verify email workflow using API endpoints
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:4000/api';

// Test order data
const testOrderData = {
  customerName: "Test Customer",
  customerEmail: "rythudipo12@gmail.com", // Change this to your email
  mobile: "9876543210",
  village: "Test Village",
  district: "Test District",
  pincode: "123456",
  state: "Andhra Pradesh",
  bookCode: "BOOK001", // Make sure this book exists in your database
  bookName: "Test Book",
  utr: "999888777666", // Unique UTR for testing
  amount: 35
};

async function testEmailWorkflow() {
  try {
    console.log("🚀 Testing Email Workflow...\n");
    
    // Test 1: Create Order (should send both admin and customer emails)
    console.log("📧 Test 1: Creating order - should send emails to admin AND customer");
    console.log(`Admin email: payment.haribookstore1@gmail.com`);
    console.log(`Customer email: ${testOrderData.customerEmail}\n`);
    
    const createResponse = await fetch(`${API_BASE}/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testOrderData)
    });
    
    const createResult = await createResponse.json();
    console.log("Create Order Response:", createResult);
    
    if (createResult.success) {
      const orderId = createResult.orderId;
      console.log(`✅ Order created successfully with ID: ${orderId}`);
      console.log("📧 Check emails now!\n");
      
      // Wait a moment for emails to be sent
      console.log("⏳ Waiting 3 seconds for emails to be sent...\n");
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Test 2: Confirm Order (should send confirmation email to customer)
      console.log("📧 Test 2: Confirming order - should send 'Order Confirmed' email to customer");
      
      const confirmResponse = await fetch(`${API_BASE}/payment/confirm/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          verificationStatus: 'verified',
          adminNotes: 'Payment verified successfully - Test'
        })
      });
      
      const confirmResult = await confirmResponse.json();
      console.log("Confirm Order Response:", confirmResult);
      
      if (confirmResult.success) {
        console.log("✅ Order confirmed successfully");
        console.log("📧 Check customer email for confirmation!\n");
        
        console.log("🎉 EMAIL WORKFLOW TEST COMPLETED!");
        console.log("\n📧 Expected emails sent:");
        console.log("1. ✅ Admin notification → payment.haribookstore1@gmail.com");
        console.log("2. ✅ Customer 'Order Received' → " + testOrderData.customerEmail);
        console.log("3. ✅ Customer 'Order Confirmed' → " + testOrderData.customerEmail);
        
      } else {
        console.log("❌ Order confirmation failed:", confirmResult.message);
      }
      
    } else {
      console.log("❌ Order creation failed:", createResult.message);
    }
    
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    console.log("\n🔧 Make sure:");
    console.log("1. Backend server is running on port 4000");
    console.log("2. MongoDB is connected");
    console.log("3. Email credentials are correct");
    console.log("4. A book with code 'BOOK001' exists in database");
  }
}

// Run the test
testEmailWorkflow();