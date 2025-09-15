// reset-user.js - Script to reset user data for testing
import mongoose from 'mongoose';
import User from './models/user.model.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const email = process.argv[2];

if (!email) {
    console.log('❌ Please provide an email address');
    console.log('Usage: node reset-user.js <email>');
    console.log('Example: node reset-user.js harinarayana981@gmail.com');
    process.exit(1);
}

async function resetUser() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        console.log(`🔍 Looking for user with email: ${email}`);
        const user = await User.findOne({ email });

        if (!user) {
            console.log('❌ User not found in database');
            process.exit(0);
        }

        console.log('👤 User found:', {
            id: user._id,
            fullname: user.fullname,
            email: user.email,
            verified: user.verified,
            hasOTP: !!user.otp,
            createdAt: user.createdAt
        });

        console.log('🗑️ Deleting user...');
        await User.deleteOne({ email });
        console.log('✅ User deleted successfully!');
        console.log('💡 You can now signup with this email again');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
}

resetUser();