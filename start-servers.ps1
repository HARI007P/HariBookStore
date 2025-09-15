# start-servers.ps1 - PowerShell script to start both backend and frontend
Write-Host "🚀 Starting HariBookStore Application..." -ForegroundColor Green
Write-Host ""

# Kill any existing node processes
Write-Host "🧹 Cleaning up existing processes..." -ForegroundColor Yellow
try {
    Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
} catch {
    # Ignore errors if no processes found
}

# Start Backend Server
Write-Host "🔧 Starting Backend Server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList '-Command "cd Backend; Write-Host ''Backend Server Starting on Port 4000...''; node index.js"' -WindowStyle Normal

# Wait for backend to start
Write-Host "⏳ Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Test backend connection
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4000" -UseBasicParsing -TimeoutSec 10
    Write-Host "✅ Backend Server is running successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend Server failed to start!" -ForegroundColor Red
    Write-Host "Please check the backend terminal window for errors." -ForegroundColor Red
    Read-Host "Press Enter to continue anyway..."
}

# Start Frontend Server
Write-Host ""
Write-Host "🎨 Starting Frontend Server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList '-Command "cd Frontend; Write-Host ''Frontend Server Starting...''; npm run dev"' -WindowStyle Normal

Write-Host ""
Write-Host "🎉 Servers are starting up!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 URLs:" -ForegroundColor White
Write-Host "   • Backend API: http://localhost:4000" -ForegroundColor Cyan
Write-Host "   • Frontend:    http://localhost:3001 (or check frontend terminal)" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔧 Testing:" -ForegroundColor White
Write-Host "   • Run test-connection.js to verify API endpoints" -ForegroundColor Yellow
Write-Host "   • Use browser developer tools to check network requests" -ForegroundColor Yellow
Write-Host ""
Write-Host "❓ Troubleshooting:" -ForegroundColor White
Write-Host "   • If signup fails, check email configuration in Backend/.env" -ForegroundColor Red
Write-Host "   • If CORS errors occur, check browser console for specific errors" -ForegroundColor Red
Write-Host "   • Ensure MongoDB connection is working (check backend terminal)" -ForegroundColor Red
Write-Host ""

# Keep script open
Write-Host "Press any key to close this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")