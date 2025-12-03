@echo off
echo ========================================
echo FactOS ERP - Starting Services
echo ========================================
echo.

REM Check if Docker is running
docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not running. Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo [1/3] Starting Database and Redis with Docker...
docker-compose up -d db redis

echo Waiting for database to be ready...
timeout /t 5 /nobreak >nul

echo.
echo [2/3] Installing Backend dependencies...
cd backend
if not exist "node_modules\" (
    echo Installing backend dependencies...
    call npm install
) else (
    echo Backend dependencies already installed.
)

echo.
echo [3/3] Installing Frontend dependencies...
cd ..\frontend
if not exist "node_modules\" (
    echo Installing frontend dependencies...
    call npm install
) else (
    echo Frontend dependencies already installed.
)

cd ..

echo.
echo ========================================
echo Services Ready! Starting Development Servers...
echo ========================================
echo.
echo Backend API:     http://localhost:8000/api/v1
echo API Docs:        http://localhost:8000/api/docs
echo Frontend:        http://localhost:3000
echo Database:        localhost:5432 (user: b3_user, pass: b3_password)
echo Redis:           localhost:6379
echo.
echo Press Ctrl+C to stop the servers
echo ========================================
echo.

REM Start backend and frontend in separate windows
start "B3 ERP Backend" cmd /k "cd backend && npm run start:dev"
timeout /t 3 /nobreak >nul
start "B3 ERP Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Development servers started in separate windows.
echo Close this window or press any key to exit setup.
pause >nul
