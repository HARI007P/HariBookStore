# 🔧 HariBookStore Login/Signup Issue - Diagnosis and Fix

## 📋 Issues Found and Fixed

### 1. **Backend Server Not Running**
- **Issue**: The backend server wasn't started, causing all API calls to fail
- **Fix**: Start the backend server from the correct directory (`Backend/`)
- **Solution**: Use `cd Backend && node index.js`

### 2. **Environment Variables Loading Issue** 
- **Issue**: Backend was looking for `.env` file in wrong location
- **Fix**: The `.env` file is correctly placed in `Backend/.env`, just need to run server from Backend directory

### 3. **CORS Configuration**
- **Issue**: Frontend running on port 3001 wasn't in CORS allowed origins
- **Fix**: Added `http://localhost:3001` to the CORS configuration in `Backend/index.js`

### 4. **User Verification Requirement**
- **Issue**: Users must be verified via OTP before they can login
- **How it works**: 
  1. Signup sends OTP to email (doesn't create account yet)
  2. User verifies OTP to complete account creation
  3. Only then can user login

## ✅ Current Status

### Backend API ✅
- **Status**: Working correctly
- **Database**: Connected to MongoDB Atlas successfully
- **Email Service**: Configured and working
- **Endpoints**: All endpoints responding correctly

### Frontend ✅
- **Status**: Starts successfully on port 3001
- **API Integration**: Properly configured to call backend
- **Authentication Flow**: Correct OTP-based signup process

### Connection ✅
- **CORS**: Fixed to allow frontend port
- **API Calls**: Backend and frontend can communicate

## 🚀 How to Start the Application

### Option 1: Automatic Startup (Recommended)
```powershell
.\start-servers.ps1
```

### Option 2: Manual Startup
```powershell
# Terminal 1 - Backend
cd Backend
node index.js

# Terminal 2 - Frontend  
cd Frontend
npm run dev
```

## 🧪 Testing the Connection

Run the test script to verify everything is working:
```powershell
node test-connection.js
```

## 📱 How to Use Login/Signup

### For Signup:
1. Go to http://localhost:3001/signup
2. Fill in your details (use a real email address)
3. Click "Submit" - this sends an OTP to your email
4. Check your email for the 6-digit code
5. Enter the OTP code to complete signup
6. You'll be automatically logged in

### For Login:
1. Go to http://localhost:3001/login  
2. Use the email and password from your completed signup
3. Login will work only after OTP verification is complete

## ⚠️ Important Notes

### Email Configuration
- The app uses Gmail SMTP with app password authentication
- Email: `hari07102004p@gmail.com` 
- If OTP emails aren't being sent, check email configuration in `Backend/.env`

### User Verification Flow
- **Regular signup route** (`/api/user/signup`) creates unverified users
- **OTP signup flow** (`/api/otp/send` → `/api/otp/verify`) creates verified users
- **Login requires verified users** - this is why direct signup → login might fail

### Database
- Uses MongoDB Atlas cloud database
- Connection string is working and valid
- User data is stored with verification status

## 🔍 Troubleshooting

### If login still fails:
1. Check browser developer tools (F12) → Network tab for API call errors
2. Verify the user was created and verified (check MongoDB or backend logs)
3. Ensure the backend server is running and accessible

### If signup fails:
1. Check email configuration in `Backend/.env`
2. Verify Gmail app password is correct
3. Check backend terminal for email sending errors

### If CORS errors appear:
1. Ensure frontend port matches CORS configuration in backend
2. Check browser console for specific CORS error messages

## 📁 File Changes Made

1. **`Backend/index.js`** - Added `localhost:3001` to CORS origins
2. **`start-servers.ps1`** - Created startup script  
3. **`test-connection.js`** - Created API test script

## 🎯 Next Steps

1. Run `.\start-servers.ps1` to start both servers
2. Open http://localhost:3001 in your browser
3. Try the complete signup flow with your real email
4. After verification, test the login functionality
5. Check browser developer tools if you encounter any issues

## 💡 Technical Details

- **Backend**: Node.js + Express + MongoDB + Nodemailer
- **Frontend**: React + Vite + Axios for API calls
- **Authentication**: JWT tokens stored in localStorage
- **Email OTP**: 6-digit codes sent via Gmail SMTP
- **User Flow**: OTP verification → Account creation → JWT login