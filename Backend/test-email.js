// Test email functionality
import dotenv from "dotenv";
import nodemailer from "nodemailer";

// Load environment variables
dotenv.config();

console.log("🔍 Testing email configuration...");
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "LOADED" : "NOT LOADED");

function getEmailTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    debug: true,
    logger: true
  });
}

async function testEmailTransporter() {
  try {
    console.log("🔧 Creating email transporter...");
    const transporter = getEmailTransporter();
    
    console.log("🔍 Verifying transporter...");
    await transporter.verify();
    console.log("✅ Email transporter verification successful!");
    
    console.log("📧 Sending test email...");
    const info = await transporter.sendMail({
      from: `"HariBookStore Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to self for testing
      subject: "🧪 Email Transporter Test",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>✅ Email Transporter Test Successful!</h2>
          <p>This email confirms that your Gmail app password is working correctly.</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        </div>
      `
    });
    
    console.log("✅ Test email sent successfully!", {
      messageId: info.messageId,
      response: info.response
    });
    
  } catch (error) {
    console.error("❌ Email test failed:", error);
    
    if (error.code === 'EAUTH') {
      console.error("❌ Authentication failed - Please check your Gmail app password");
    } else if (error.code === 'ECONNECTION') {
      console.error("❌ Connection failed - Please check your internet connection");
    } else if (error.responseCode === 535) {
      console.error("❌ Invalid credentials - Please verify your Gmail app password");
    }
  }
}

testEmailTransporter();