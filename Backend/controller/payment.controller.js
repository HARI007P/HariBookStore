// Backend/controller/payment.controller.js
import Payment from "../models/payment.model.js";
import Book from "../models/book.model.js";
import User from "../models/user.model.js";
import { Resend } from "resend";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
// Payment notification email

// Function to get email transporter (created when needed)

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "payment.haribookstore1@gmail.com";

// Helper function to send email using Resend
async function sendEmail({ to, subject, html }) {
  try {
    const response = await resend.emails.send({
      from: "HariBookStore <no-reply@haribookstore.com>",
      to,
      subject,
      html,
    });

    console.log(`✅ Email sent to ${to}: ${response.data?.id || "OK"}`);
  } catch (error) {
    console.error(`❌ Email send error to ${to}:`, error.message);
  }
}

// Create new order/payment
export const createOrder = async (req, res) => {
  try {
    const {
      customerName,
      customerEmail, 
      mobile,
      village,
      district,
      pincode,
      state,
      bookCode,
      bookName,
      utr,
      amount
    } = req.body;

    // Validate required fields
    if (!customerName || !customerEmail || !mobile || !village || !district || !pincode || !state || !bookCode || !bookName || !utr || !amount) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Validate state (only deliver to specific states)
    const allowedStates = ['Andhra Pradesh', 'Telangana', 'Odisha'];
    if (!allowedStates.includes(state)) {
      return res.status(400).json({
        success: false,
        message: "Sorry, we only deliver to Andhra Pradesh, Telangana, and Odisha"
      });
    }

    // Check if book exists
    const book = await Book.findOne({ bookcode: bookCode });
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found with the provided book code"
      });
    }

    // Fixed pricing structure: Book price ₹1 + Delivery ₹34 = Total ₹35
    const FIXED_BOOK_PRICE = 1;
    const DELIVERY_CHARGE = 34;
    const EXPECTED_TOTAL = FIXED_BOOK_PRICE + DELIVERY_CHARGE; // ₹35
    
    if (amount !== EXPECTED_TOTAL) {
      return res.status(400).json({
        success: false,
        message: `Price mismatch. Expected total: ₹${EXPECTED_TOTAL}, Received: ₹${amount}`
      });
    }

    // Check if UTR already exists
    const existingOrder = await Payment.findOne({ "payment.utr": utr });
    if (existingOrder) {
      return res.status(400).json({
        success: false,
        message: "UTR number already used. Please check your UTR number."
      });
    }

    // Create new order
    const newOrder = new Payment({
      customerName,
      customerEmail,
      mobile,
      address: {
        village,
        district,
        pincode,
        state
      },
      bookDetails: {
        bookCode,
        bookName: book.name,
        price: FIXED_BOOK_PRICE // Using fixed book price of ₹1
      },
      payment: {
        utr,
        amount,
        upiId: "7416219267@ybl",
        verificationStatus: "pending"
      },
      orderStatus: "pending"
    });

    await newOrder.save();

    // Send email to admin about new order
    await sendAdminOrderNotification(newOrder);

    // Send order received confirmation email to customer
    await sendCustomerOrderConfirmation(newOrder);

    res.status(201).json({
      success: true,
      message: "Order placed successfully! We will verify your payment and send you a confirmation email shortly.",
      orderId: newOrder._id,
      orderDetails: {
        bookName: book.name,
        amount: amount,
        utr: utr,
        status: "pending"
      }
    });

  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order. Please try again."
    });
  }
};

// Get all orders (Admin only)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Payment.find()
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({
      success: true,
      orders: orders,
      total: orders.length
    });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders"
    });
  }
};

// Get single order
export const getOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Payment.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.status(200).json({
      success: true,
      order: order
    });
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order"
    });
  }
};

// Confirm order (Admin only)
export const confirmOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { adminNotes, verificationStatus } = req.body;

    const order = await Payment.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Update order status
    order.payment.verificationStatus = verificationStatus || "verified";
    order.orderStatus = verificationStatus === "verified" ? "confirmed" : "cancelled";
    order.confirmedDate = verificationStatus === "verified" ? new Date() : null;
    order.adminNotes = adminNotes || "";

    await order.save();

    // Send confirmation/cancellation email to customer
    if (verificationStatus === "verified") {
      await sendOrderConfirmedEmail(order);
    } else {
      await sendOrderCancelledEmail(order);
    }

    res.status(200).json({
      success: true,
      message: `Order ${verificationStatus === "verified" ? "confirmed" : "cancelled"} successfully`,
      order: order
    });

  } catch (error) {
    console.error("Confirm order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order status"
    });
  }
};

// Update order status (Admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, adminNotes } = req.body;

    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status"
      });
    }

    const order = await Payment.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Update status and timestamps
    order.orderStatus = status;
    order.adminNotes = adminNotes || order.adminNotes;
    
    if (status === "shipped" && !order.shippedDate) {
      order.shippedDate = new Date();
    }
    if (status === "delivered" && !order.deliveredDate) {
      order.deliveredDate = new Date();
    }

    await order.save();

    // Send status update email to customer
    await sendOrderStatusUpdateEmail(order);

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: order
    });

  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order status"
    });
  }
};
// ------------------- Send Admin Order Notification -------------------
async function sendAdminOrderNotification(order) {
  try {
    console.log(`📧 Sending admin notification for order: ${order._id}`);

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 8px; color: white; text-align: center;">
          <h1>🛒 New Order Received!</h1>
          <p>Order ID: ${order._id}</p>
        </div>
        
        <div style="padding: 20px; border: 1px solid #ddd; border-radius: 8px; margin-top: 10px;">
          <h3>📚 Book Details:</h3>
          <p><strong>Book:</strong> ${order.bookDetails.bookName}</p>
          <p><strong>Code:</strong> ${order.bookDetails.bookCode}</p>
          <p><strong>Price:</strong> ₹${order.bookDetails.price}</p>
          
          <h3>👤 Customer Details:</h3>
          <p><strong>Name:</strong> ${order.customerName}</p>
          <p><strong>Email:</strong> ${order.customerEmail}</p>
          <p><strong>Mobile:</strong> ${order.mobile}</p>
          
          <h3>📍 Delivery Address:</h3>
          <p>${order.fullAddress}</p>
          
          <h3>💳 Payment Details:</h3>
          <p><strong>UTR:</strong> ${order.payment.utr}</p>
          <p><strong>Amount:</strong> ₹${order.payment.amount}</p>
          <p><strong>UPI ID:</strong> ${order.payment.upiId}</p>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 20px; text-align: center;">
            <p><strong>⚠️ Action Required:</strong></p>
            <p>Please verify the UTR number and confirm this order.</p>
          </div>
        </div>
      </div>
    `;

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: "HariBookStore <no-reply@haribookstore.com>",
      to: ADMIN_EMAIL,
      subject: `🛍 New Order: ${order.bookDetails.bookName} - ${order._id}`,
      html: emailContent,
    });

    if (error) {
      console.error("❌ Failed to send admin email:", error);
      throw new Error(error.message || "Failed to send admin email");
    }

    console.log(`✅ Admin notification sent successfully for order: ${order._id}`, data);

  } catch (error) {
    console.error(`❌ Admin email error for order ${order._id}:`, error.message);

    // More descriptive error handling
    if (error.message.includes("401")) {
      console.error("❌ Invalid or expired RESEND_API_KEY. Check your .env file.");
    } else if (error.message.includes("DNS") || error.message.includes("fetch")) {
      console.error("❌ Network/DNS issue. Render may be blocking SMTP — Resend should fix it.");
    } else {
      console.error("⚠️ Unknown email error:", error);
    }
  }
}


// ✅ Send Order Received Email to Customer
async function sendCustomerOrderConfirmation(order) {
  try {
    console.log(`📧 Sending customer confirmation for order: ${order._id} to ${order.customerEmail}`);

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    padding: 20px; border-radius: 8px; color: white; text-align: center;">
          <h1>📚 HariBookStore</h1>
          <h2>Order Received Successfully! 🎉</h2>
        </div>
        
        <div style="padding: 20px; border: 1px solid #ddd; border-radius: 8px; margin-top: 10px;">
          <p>Dear <strong>${order.customerName}</strong>,</p>
          <p>Thank you for your order! We have received your order and payment details.</p>
          
          <h3>📋 Order Details:</h3>
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Book:</strong> ${order.bookDetails.bookName}</p>
          <p><strong>Amount:</strong> ₹${order.payment.amount}</p>
          <p><strong>UTR:</strong> ${order.payment.utr}</p>
          
          <h3>📍 Delivery Address:</h3>
          <p>${order.fullAddress}</p>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4>⏳ What happens next?</h4>
            <p>1️⃣ We will verify your payment using the UTR number</p>
            <p>2️⃣ Once verified, we'll confirm your order</p>
            <p>3️⃣ Your book will be delivered within 3 working days</p>
          </div>
          
          <div style="text-align: center; margin-top: 20px;">
            <p>Thank you for choosing HariBookStore! 📚</p>
            <p style="color: #666; font-size: 14px;">
              For any queries, contact us at ${process.env.ADMIN_EMAIL || "payment.haribookstore1@gmail.com"}
            </p>
          </div>
        </div>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: "HariBookStore <no-reply@haribookstore.com>",
      to: order.customerEmail,
      subject: `📚 Order Received: ${order.bookDetails.bookName} - Order #${order._id}`,
      html: emailContent,
    });

    if (error) throw new Error(error.message || "Failed to send customer confirmation email");

    console.log(`✅ Customer confirmation sent successfully for order: ${order._id}`, data);
  } catch (error) {
    console.error(`❌ Customer confirmation email error for order ${order._id}:`, error.message);
  }
}
// ✅ Send Order Confirmed Email to Customer
async function sendOrderConfirmedEmail(order) {
  try {
    console.log(`📧 Sending order confirmation for order: ${order._id}`);

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
                    padding: 20px; border-radius: 8px; color: white; text-align: center;">
          <h1>✅ Order Confirmed!</h1>
          <h2>Your book is on its way! 🚚</h2>
        </div>
        
        <div style="padding: 20px; border: 1px solid #ddd; border-radius: 8px; margin-top: 10px;">
          <p>Dear <strong>${order.customerName}</strong>,</p>
          <p>Great news! Your payment has been verified and your order is confirmed.</p>
          
          <h3>📋 Order Details:</h3>
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Book:</strong> ${order.bookDetails.bookName}</p>
          <p><strong>Amount:</strong> ₹${order.payment.amount}</p>
          
          <h3>📍 Delivery Address:</h3>
          <p>${order.fullAddress}</p>
          
          <div style="background: #d1fae5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4>🚚 Delivery Information:</h4>
            <p><strong>Estimated Delivery:</strong> Within 3 working days</p>
            <p><strong>Delivery States:</strong> Andhra Pradesh, Telangana, Odisha</p>
            <p>Your book will be carefully packed and delivered soon.</p>
          </div>
          
          ${order.adminNotes ? `
            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4>📝 Order Notes:</h4>
              <p>${order.adminNotes}</p>
            </div>` : ""}
          
          <div style="text-align: center; margin-top: 20px;">
            <p>Thank you for choosing HariBookStore! 📚</p>
            <p>Happy Reading! 🎉</p>
            <p style="color: #666; font-size: 14px;">For any queries, reply to this email</p>
          </div>
        </div>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: "HariBookStore <no-reply@haribookstore.com>",
      to: order.customerEmail,
      subject: `✅ Order Confirmed: ${order.bookDetails.bookName} - Delivery in 3 days!`,
      html: emailContent,
    });

    if (error) throw new Error(error.message || "Failed to send confirmation email");

    console.log(`✅ Order confirmation sent successfully for order: ${order._id}`, data);
  } catch (error) {
    console.error(`❌ Order confirmation email error for order ${order._id}:`, error.message);
  }
}

// ========================= 📧 SEND ORDER CANCELLED EMAIL =========================
// ------------------------ 📧 SEND ORDER CANCELLED EMAIL ------------------------
async function sendOrderCancelledEmail(order) {
  try {
    console.log(`📧 Sending order cancellation email for order: ${order._id}`);

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #ef4444; padding: 20px; border-radius: 8px; color: white; text-align: center;">
          <h1>❌ Order Cancelled</h1>
          <h2>Payment Verification Failed</h2>
        </div>
        <div style="padding: 20px; border: 1px solid #ddd; border-radius: 8px; margin-top: 10px;">
          <p>Dear <strong>${order.customerName}</strong>,</p>
          <p>We’re sorry to inform you that your payment could not be verified for the following order:</p>

          <h3>📋 Order Details:</h3>
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Book:</strong> ${order.bookDetails.bookName}</p>
          <p><strong>UTR:</strong> ${order.payment.utr}</p>

          ${
            order.adminNotes
              ? `<div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
                  <h4>📝 Reason for Cancellation:</h4>
                  <p>${order.adminNotes}</p>
                </div>`
              : ""
          }

          <div style="background: #fff7ed; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4>🔄 What You Can Do:</h4>
            <ul style="padding-left: 20px; color: #333;">
              <li>Check your UTR number and resubmit the form</li>
              <li>Ensure payment was made to <strong>7416219267@ybl</strong></li>
              <li>Contact us if you believe this is an error</li>
            </ul>
          </div>

          <div style="text-align: center; margin-top: 20px;">
            <p>We apologize for the inconvenience.</p>
            <p style="color: #666; font-size: 14px;">
              For help, reply to this email or contact us at ${process.env.ADMIN_EMAIL || "payment.haribookstore1@gmail.com"}
            </p>
          </div>
        </div>
      </div>
    `;

    const response = await resend.emails.send({
      from: "HariBookStore <no-reply@haribookstore.com>",
      to: order.customerEmail,
      subject: `❌ Order Cancelled: ${order.bookDetails.bookName} - Payment Issue`,
      html: emailContent,
    });

    console.log(`✅ Order cancellation email sent successfully!`, {
      orderId: order._id,
      to: order.customerEmail,
      resendId: response.data?.id || "OK",
    });
  } catch (error) {
    console.error(`❌ Order cancellation email error for order ${order._id}:`, error.message);
  }
}

// ------------------------ 📧 SEND ORDER STATUS UPDATE EMAIL ------------------------
async function sendOrderStatusUpdateEmail(order) {
  try {
    console.log(`📧 Sending order status update for order: ${order._id}, Status: ${order.orderStatus}`);

    let statusMessage = "";
    let bgColor = "";
    let emoji = "";

    switch (order.orderStatus) {
      case "processing":
        statusMessage = "Your order is being processed.";
        bgColor = "#3b82f6";
        emoji = "⚙️";
        break;
      case "shipped":
        statusMessage = "Your order has been shipped!";
        bgColor = "#8b5cf6";
        emoji = "🚚";
        break;
      case "delivered":
        statusMessage = "Your order has been delivered!";
        bgColor = "#22c55e";
        emoji = "✅";
        break;
      default:
        console.log("ℹ️ No email sent for this status.");
        return;
    }

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: ${bgColor}; padding: 20px; border-radius: 8px; color: white; text-align: center;">
          <h1>${emoji} Order Update</h1>
          <h2>${statusMessage}</h2>
        </div>
        <div style="padding: 20px; border: 1px solid #ddd; border-radius: 8px; margin-top: 10px;">
          <p>Dear <strong>${order.customerName}</strong>,</p>

          <h3>📋 Order Details:</h3>
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Book:</strong> ${order.bookDetails.bookName}</p>
          <p><strong>Status:</strong> ${order.orderStatus.toUpperCase()}</p>

          ${
            order.orderStatus === "delivered"
              ? `<div style="background: #d1fae5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <h4>🎉 Congratulations!</h4>
                  <p>Your book has been successfully delivered. We hope you enjoy reading it!</p>
                  <p>Thank you for choosing HariBookStore! 📚</p>
                </div>`
              : ""
          }

          <div style="text-align: center; margin-top: 20px;">
            <p>We’ll keep you updated on your order progress.</p>
            <p style="color: #666; font-size: 14px;">Need help? Reply to this email.</p>
          </div>
        </div>
      </div>
    `;

    const response = await resend.emails.send({
      from: "HariBookStore <no-reply@haribookstore.com>",
      to: order.customerEmail,
      subject: `${emoji} Order Update: ${order.bookDetails.bookName} - ${statusMessage}`,
      html: emailContent,
    });

    console.log(`✅ Status update email sent successfully!`, {
      orderId: order._id,
      status: order.orderStatus,
      to: order.customerEmail,
      resendId: response.data?.id || "OK",
    });
  } catch (error) {
    console.error(`❌ Status update email error for order ${order._id}:`, error.message);
  }
}
