# HariBookStore Deployment Guide

## Problem: 404 Error on Page Refresh

When deploying React SPAs (Single Page Applications), you may encounter 404 errors when refreshing pages other than the home page. This happens because:

1. **Client-side routing**: React Router handles navigation on the client side
2. **Server doesn't know routes**: When you refresh `/books`, the server looks for a file at that path
3. **No file exists**: Server returns 404 because `/books` doesn't exist as a physical file

## Solutions Implemented

### 1. For Render Deployment

#### Frontend (Static Site)
- **File**: `Frontend/public/_redirects`
- **Content**: `/*    /index.html   200`
- **Purpose**: Redirects all routes to index.html, letting React Router handle routing

#### Using render.yaml (Recommended)
- **File**: `render.yaml` (in root directory)
- Configures both backend and frontend services
- Sets up proper routing rules for the frontend

#### Manual Render Configuration
If not using render.yaml, configure manually:

1. **Service Type**: Static Site
2. **Build Command**: `cd Frontend && npm install && npm run build`
3. **Publish Directory**: `Frontend/dist`
4. **Redirects**: Add rule `/*` → `/index.html` (200)

### 2. For Netlify Deployment

#### Alternative Option
- **File**: `Frontend/netlify.toml`
- Handles build and redirect configuration for Netlify

### 3. For Other Hosting Platforms

#### Vercel
Create `vercel.json` in Frontend directory:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

#### Apache Server
Create `.htaccess` in Frontend/dist:
```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

#### Nginx
Add to nginx.conf:
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## Deployment Steps

### Backend Deployment (Render)
1. Create new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `cd Backend && npm install`
4. Set start command: `cd Backend && npm start`
5. Add environment variables:
   - `NODE_ENV=production`
   - `MONGO_URI` (your MongoDB connection string)
   - `JWT_SECRET` (your JWT secret)
   - `EMAIL_USER` (your email for OTP)
   - `EMAIL_PASS` (your email app password)

### Frontend Deployment (Render)
1. Create new Static Site on Render
2. Connect your GitHub repository
3. Set build command: `cd Frontend && npm install && npm run build`
4. Set publish directory: `Frontend/dist`
5. Add redirect rule: `/*` → `/index.html` (200)
6. Set environment variable: `VITE_API_URL` (your backend URL)

### Alternative: Use render.yaml
1. Place `render.yaml` in your repository root
2. Create new service from YAML on Render
3. Connect your GitHub repository
4. Render will auto-configure both services

## Environment Variables

### Backend (.env)
```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-url.onrender.com
```

## Testing After Deployment

1. Visit your deployed frontend URL
2. Navigate to different routes (e.g., `/signup`, `/books`)
3. Refresh the page on each route
4. Verify no 404 errors occur
5. Test signup and login functionality

## Common Issues & Solutions

### Issue: CORS Errors
**Solution**: Update backend CORS configuration to include your deployed frontend URL

### Issue: API Calls Failing
**Solution**: Check VITE_API_URL in frontend environment variables

### Issue: Environment Variables Not Working
**Solution**: Make sure VITE_ prefix is used for frontend variables

### Issue: Build Fails
**Solution**: Check Node.js version compatibility and dependencies

## Notes

- The `_redirects` file must be in `Frontend/public/` to be copied to the build output
- Always test routing after deployment
- Monitor browser console for any errors
- Use HTTPS URLs in production for security