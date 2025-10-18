# B3 MACBIS ERP - Windows Setup Guide

## 🚀 Quick Start (Windows)

### Option 1: UI Development Only (Fastest - No Backend)
Perfect for frontend/UI/UX work:
```powershell
.\ui.bat
```
Then open http://localhost:3000

### Option 2: Full Stack Development
Runs backend + frontend + database:
```powershell
.\start.bat
```

## 📋 Prerequisites

Before running the project, make sure you have:

1. **Node.js 20+** - [Download here](https://nodejs.org/)
   ```powershell
   node --version  # Should show v20.x.x or higher
   ```

2. **Docker Desktop** - [Download here](https://www.docker.com/products/docker-desktop/)
   - Required for PostgreSQL and Redis
   - Make sure Docker Desktop is running before starting

3. **Git** - [Download here](https://git-scm.com/download/win)

## 🔧 Installation Steps

### 1. Clone the Repository
```powershell
git clone <repository-url>
cd b3-erp
```

### 2. Environment Setup
The `.env` files have been created for you with default values:
- `backend\.env` - Backend configuration
- `frontend\.env.local` - Frontend configuration

### 3. Start Development

#### For UI Development (Frontend Only):
```powershell
.\ui.bat
```
- No database required
- Uses mock data
- Starts on http://localhost:3000

#### For Full Stack Development:
```powershell
.\start.bat
```
This will:
- Start PostgreSQL database (port 5432)
- Start Redis (port 6379)
- Install dependencies if needed
- Start backend server (port 8000)
- Start frontend server (port 3000)

## 🌐 Access Points

Once running, access these URLs:

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Main application UI |
| Backend API | http://localhost:8000/api/v1 | REST API endpoints |
| API Docs | http://localhost:8000/api/docs | Swagger documentation |
| Database | localhost:5432 | PostgreSQL (user: b3_user, pass: b3_password) |
| Redis | localhost:6379 | Cache and queues |

## 🛠️ Manual Commands

If you prefer to run services manually:

### Start Database & Redis:
```powershell
docker-compose up -d db redis
```

### Backend:
```powershell
cd backend
npm install
npm run start:dev
```

### Frontend:
```powershell
cd frontend
npm install
npm run dev
```

## 🐛 Troubleshooting

### Port Already in Use
If you get "port already in use" errors:

**Backend (Port 8000):**
```powershell
# Find the process
netstat -ano | findstr :8000
# Kill it (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**Frontend (Port 3000):**
```powershell
# Find the process
netstat -ano | findstr :3000
# Kill it (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Docker Not Running
1. Start Docker Desktop
2. Wait for it to fully start
3. Run `start.bat` again

### Dependencies Not Installing
```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
cd backend
rm -r node_modules
npm install

cd ..\frontend
rm -r node_modules
npm install
```

### Database Connection Issues
```powershell
# Restart Docker containers
docker-compose down
docker-compose up -d db redis

# Wait 5-10 seconds for database to be ready
# Then start backend
cd backend
npm run start:dev
```

## 🧪 Testing

### Run Backend Tests:
```powershell
cd backend
npm test
```

### Run Frontend Tests:
```powershell
cd frontend
npm test
```

## 📦 Building for Production

### Backend:
```powershell
cd backend
npm run build
npm run start:prod
```

### Frontend:
```powershell
cd frontend
npm run build
npm start
```

## 🔑 Default Credentials

### Database:
- Host: localhost
- Port: 5432
- Database: b3_erp
- Username: b3_user
- Password: b3_password

### Redis:
- Host: localhost
- Port: 6379
- Password: (none)

## 📝 Additional Notes

- Environment files (`.env`, `.env.local`) are already configured with development defaults
- For production, update secrets in environment files
- The backend uses NestJS framework
- The frontend uses Next.js 14 with App Router
- Database migrations will run automatically on first start

## 🆘 Getting Help

For more detailed information:
- [QUICK_START.md](./QUICK_START.md) - Quick reference
- [DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md) - Detailed setup guide
- [UI_DEVELOPMENT.md](./UI_DEVELOPMENT.md) - UI development guide

## 📧 Support

If you encounter issues not covered here, please:
1. Check the logs in the terminal windows
2. Verify all prerequisites are installed
3. Make sure Docker Desktop is running
4. Try restarting the services
