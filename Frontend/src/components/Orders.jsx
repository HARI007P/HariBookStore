import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { paymentService } from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaArrowLeft, FaBook, FaClock, FaCheckCircle, FaTruck, FaTimesCircle, FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";

function Orders() {
  const { authUser } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authUser) {
      toast.error("Please login to view your orders");
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [authUser, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await paymentService.getPaymentHistory();
      
      if (response.success) {
        // Filter orders by current user's email
        const userOrders = response.orders.filter(
          order => order.customerEmail === authUser.email
        );
        setOrders(userOrders);
      } else {
        setError("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <FaClock className="text-yellow-500" />;
      case 'confirmed':
        return <FaCheckCircle className="text-green-500" />;
      case 'processing':
        return <FaSpinner className="text-blue-500 animate-spin" />;
      case 'shipped':
        return <FaTruck className="text-purple-500" />;
      case 'delivered':
        return <FaCheckCircle className="text-green-600" />;
      case 'cancelled':
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-200 text-green-900 border-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <FaSpinner className="text-4xl text-pink-400 animate-spin mx-auto mb-4" />
            <p className="text-xl">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <button
            onClick={() => navigate("/books")}
            className="flex items-center gap-2 text-white hover:text-pink-400 transition-colors duration-300"
          >
            <FaArrowLeft className="text-xl" />
            <span className="text-lg font-semibold">Back to Books</span>
          </button>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-4xl md:text-5xl font-bold text-center mb-8"
        >
          My <span className="text-pink-400">Orders</span>
        </motion.h1>

        {/* Orders List */}
        {error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 max-w-md mx-auto">
              <FaTimesCircle className="text-red-400 text-4xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Error Loading Orders</h3>
              <p className="text-gray-300 mb-4">{error}</p>
              <button
                onClick={fetchOrders}
                className="bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded-lg transition-colors duration-300"
              >
                Try Again
              </button>
            </div>
          </motion.div>
        ) : orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="bg-gray-800/50 rounded-lg p-8 max-w-md mx-auto">
              <FaBook className="text-gray-400 text-6xl mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-4">No Orders Yet</h3>
              <p className="text-gray-300 mb-6">
                You haven't placed any orders yet. Start exploring our amazing collection of books!
              </p>
              <button
                onClick={() => navigate("/books")}
                className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 px-6 py-3 rounded-lg font-semibold transition-all duration-300"
              >
                Browse Books
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {orders.map((order, index) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-black/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="bg-pink-500/20 p-3 rounded-lg">
                        <FaBook className="text-pink-400 text-xl" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">
                          {order.bookDetails.bookName}
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                          <div>
                            <p><strong>Order ID:</strong> {order._id.slice(-8)}</p>
                            <p><strong>Book Code:</strong> {order.bookDetails.bookCode}</p>
                            <p><strong>UTR:</strong> {order.payment.utr}</p>
                          </div>
                          
                          <div>
                            <p><strong>Order Date:</strong> {formatDate(order.createdAt)}</p>
                            <p><strong>Amount:</strong> ₹{order.payment.amount}</p>
                            <p><strong>Delivery:</strong> {order.fullAddress}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex flex-col items-start lg:items-center gap-3">
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-full border ${getStatusColor(order.orderStatus)}`}>
                      {getStatusIcon(order.orderStatus)}
                      <span className="font-semibold capitalize">
                        {order.orderStatus}
                      </span>
                    </div>
                    
                    {order.payment.verificationStatus && (order.orderStatus === 'pending' || order.orderStatus === 'cancelled') && (
                      <div className={`text-xs px-2 py-1 rounded ${
                        order.payment.verificationStatus === 'verified' 
                          ? 'bg-green-500/20 text-green-400' 
                          : order.payment.verificationStatus === 'failed'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        Payment: {order.payment.verificationStatus}
                      </div>
                    )}
                  </div>
                </div>

                {/* Admin Notes */}
                {order.adminNotes && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-sm text-gray-400">
                      <strong>Note:</strong> {order.adminNotes}
                    </p>
                  </div>
                )}

                {/* Timeline */}
                {(order.confirmedDate || order.shippedDate || order.deliveredDate) && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <h4 className="text-sm font-semibold mb-2 text-gray-400">Order Timeline:</h4>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                      <span>Ordered: {formatDate(order.createdAt)}</span>
                      {order.confirmedDate && (
                        <span>Confirmed: {formatDate(order.confirmedDate)}</span>
                      )}
                      {order.shippedDate && (
                        <span>Shipped: {formatDate(order.shippedDate)}</span>
                      )}
                      {order.deliveredDate && (
                        <span>Delivered: {formatDate(order.deliveredDate)}</span>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}

export default Orders;