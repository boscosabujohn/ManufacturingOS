# B3 MACBIS ERP - PowerShell Startup Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "B3 MACBIS ERP - Starting Services" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
Write-Host "[Checking] Docker status..." -ForegroundColor Yellow
try {
    docker ps | Out-Null
    Write-Host "[OK] Docker is running" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Docker is not running. Please start Docker Desktop and try again." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "[1/3] Starting Database and Redis with Docker..." -ForegroundColor Yellow
docker-compose up -d db redis

Write-Host "Waiting for database to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "[2/3] Checking Backend dependencies..." -ForegroundColor Yellow
Push-Location backend
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
    npm install
} else {
    Write-Host "Backend dependencies already installed." -ForegroundColor Green
}
Pop-Location

Write-Host ""
Write-Host "[3/3] Checking Frontend dependencies..." -ForegroundColor Yellow
Push-Location frontend
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    npm install
} else {
    Write-Host "Frontend dependencies already installed." -ForegroundColor Green
}
Pop-Location

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Services Ready! Starting Development Servers..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend API:     " -NoNewline; Write-Host "http://localhost:8000/api/v1" -ForegroundColor Green
Write-Host "API Docs:        " -NoNewline; Write-Host "http://localhost:8000/api/docs" -ForegroundColor Green
Write-Host "Frontend:        " -NoNewline; Write-Host "http://localhost:3000" -ForegroundColor Green
Write-Host "Database:        " -NoNewline; Write-Host "localhost:5432 (user: b3_user, pass: b3_password)" -ForegroundColor Green
Write-Host "Redis:           " -NoNewline; Write-Host "localhost:6379" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop the servers" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Start backend in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; npm run start:dev"
Start-Sleep -Seconds 3

# Start frontend in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; npm run dev"

Write-Host ""
Write-Host "Development servers started in separate windows." -ForegroundColor Green
Write-Host "You can close this window or press any key to exit." -ForegroundColor Yellow
Read-Host
