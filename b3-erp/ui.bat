@echo off
echo ========================================
echo OptiForge ERP - UI Development Mode
echo ========================================
echo.
echo Starting Frontend Only (No Backend Required)
echo Perfect for UI/UX Development!
echo.

cd frontend

if not exist "node_modules\" (
    echo [1/2] Installing Frontend dependencies...
    call npm install
    echo.
) else (
    echo Frontend dependencies already installed.
    echo.
)

echo [2/2] Starting Frontend Development Server...
echo.
echo ========================================
echo Frontend:  http://localhost:3000
echo ========================================
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev
