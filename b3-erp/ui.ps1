# B3 MACBIS ERP - UI Development Mode (PowerShell)
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "B3 MACBIS ERP - UI Development Mode" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Starting Frontend Only (No Backend Required)" -ForegroundColor Yellow
Write-Host "Perfect for UI/UX Development!" -ForegroundColor Green
Write-Host ""

Push-Location frontend

if (-not (Test-Path "node_modules")) {
    Write-Host "[1/2] Installing Frontend dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host ""
} else {
    Write-Host "Frontend dependencies already installed." -ForegroundColor Green
    Write-Host ""
}

Write-Host "[2/2] Starting Frontend Development Server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Frontend:  " -NoNewline; Write-Host "http://localhost:3000" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

npm run dev

Pop-Location
