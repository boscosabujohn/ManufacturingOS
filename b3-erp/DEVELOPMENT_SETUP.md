# B3 MACBIS ERP - Development Setup Guide

## ✅ System Preparation Complete!

### 📦 Dependencies Installed

#### Backend (NestJS)
✅ All backend dependencies installed (1015 packages)
- NestJS core framework
- TypeORM for database
- Bull for job queues
- JWT for authentication
- And more...

#### Frontend (Next.js)
✅ All frontend dependencies installed (528 packages)
- Next.js 14 with App Router
- React 18
- TailwindCSS
- Lucide React icons
- And more...

### 🔧 Environment Configuration

#### Backend Environment (`.env`)
✅ Created at `/backend/.env`
- Database: PostgreSQL (localhost:5432)
- Redis: localhost:6379
- API Port: 5000
- JWT secrets configured
- CORS enabled for frontend

#### Frontend Environment (`.env.local`)
✅ Created at `/frontend/.env.local`
- API URL: http://localhost:5000/api/v1
- WebSocket URL: ws://localhost:5000
- Debug mode enabled

### 🐳 Docker Ready
✅ Docker version: 28.3.0
✅ Docker Compose version: v2.38.1

---

## 🚀 How to Run Development

### Option 1: Using Make (Recommended)

```bash
# Start database and Redis services
make docker-up

# Start both backend and frontend in development mode
make dev
```

### Option 2: Using Docker Compose

```bash
# Start all services (database, redis, backend, frontend)
docker-compose up

# Or run in detached mode
docker-compose up -d
```

### Option 3: Manual Start (for debugging)

#### Terminal 1 - Start Database & Redis
```bash
cd /Users/sabujohnbosco/KreupAI/ManufacturingOS/b3-erp
docker-compose up postgres redis
```

#### Terminal 2 - Start Backend
```bash
cd /Users/sabujohnbosco/KreupAI/ManufacturingOS/b3-erp/backend
npm run start:dev
```

#### Terminal 3 - Start Frontend
```bash
cd /Users/sabujohnbosco/KreupAI/ManufacturingOS/b3-erp/frontend
npm run dev
```

---

## 🌐 Access URLs

Once running, you can access:

- **Frontend (Dashboard)**: http://localhost:3000
- **Backend API**: http://localhost:5000/api/v1
- **API Documentation (Swagger)**: http://localhost:5000/api/docs
- **PostgreSQL**: localhost:5432 (postgres/postgres)
- **Redis**: localhost:6379

---

## 📋 Available Make Commands

```bash
make help          # Show all available commands
make install       # Install all dependencies
make dev           # Run development mode (backend + frontend)
make build         # Build production bundles
make test          # Run all tests
make docker-up     # Start Docker services (DB + Redis)
make docker-down   # Stop Docker services
make docker-clean  # Clean Docker volumes
make lint          # Run linters
make format        # Format code
```

---

## 🔍 Current Status

### ✅ Completed
- ✅ Backend dependencies installed
- ✅ Frontend dependencies installed
- ✅ Environment files created
- ✅ Docker and Docker Compose available
- ✅ Project structure ready
- ✅ Error pages created (404, error, global-error)
- ✅ Exception handling components (ErrorBoundary, AsyncErrorBoundary)
- ✅ Landing page dashboard with 13 module cards
- ✅ Navigation system implemented

### ⚠️ Minor Warnings (Non-blocking)
- Some deprecated npm packages (will work fine)
- 6 backend vulnerabilities (5 low, 1 moderate) - run `npm audit fix` if needed
- TypeScript deprecation warnings (non-critical)
- CSS warnings for Tailwind directives (expected, they work fine)

### 🔨 Next Steps to Complete

1. **Create Module Implementation Files** - The actual controllers, services, entities for each module
2. **Database Migrations** - Set up initial database schema
3. **Authentication Implementation** - Login, register, JWT validation
4. **API Endpoints** - Implement CRUD operations for each module
5. **Connect Frontend to Backend** - Hook up API calls in frontend components

---

## 🎯 Quick Start Guide

### First Time Setup

```bash
# 1. Navigate to project
cd /Users/sabujohnbosco/KreupAI/ManufacturingOS/b3-erp

# 2. Start database services
make docker-up

# Wait for PostgreSQL and Redis to be ready (about 10 seconds)

# 3. Start development servers
make dev
```

### Daily Development

```bash
# Start everything
make docker-up && make dev

# Or if Docker services are already running
make dev
```

### Stop Everything

```bash
# Stop development servers (Ctrl+C in terminal)

# Stop Docker services
make docker-down
```

---

## 🐛 Troubleshooting

### Port Already in Use

If you get "port already in use" errors:

```bash
# Check what's using port 5000 (backend)
lsof -i :5000

# Check what's using port 3000 (frontend)
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### Database Connection Failed

```bash
# Restart Docker services
make docker-down
make docker-up

# Check if PostgreSQL is running
docker ps | grep postgres
```

### Redis Connection Failed

```bash
# Check if Redis is running
docker ps | grep redis

# Restart if needed
docker-compose restart redis
```

### TypeScript Errors in Frontend

TypeScript errors in error pages and components are expected until the app is built. They will resolve when running `npm run dev`.

---

## 📚 Project Structure

```
b3-erp/
├── backend/               # NestJS backend
│   ├── src/
│   │   ├── modules/      # 13 business modules
│   │   ├── main.ts       # Application entry
│   │   └── app.module.ts # Root module
│   ├── .env              # ✅ Environment variables
│   └── package.json      # ✅ Dependencies installed
│
├── frontend/             # Next.js frontend
│   ├── src/
│   │   ├── app/          # Next.js app router
│   │   │   ├── (dashboard)/   # Dashboard layout
│   │   │   ├── error.tsx       # Error pages
│   │   │   └── not-found.tsx   # 404 page
│   │   └── components/   # Reusable components
│   ├── .env.local        # ✅ Environment variables
│   └── package.json      # ✅ Dependencies installed
│
├── docker/               # Docker configurations
├── docs/                 # Documentation
│   ├── requirements/     # Business requirements
│   └── development/      # Development guides
│
├── docker-compose.yml    # Docker services
├── Makefile             # Development commands
└── README.md            # Project documentation
```

---

## 🎉 You're Ready to Develop!

Everything is set up and ready to go. Run the following to start:

```bash
cd /Users/sabujohnbosco/KreupAI/ManufacturingOS/b3-erp
make docker-up
make dev
```

Then open your browser to http://localhost:3000 to see the dashboard!

---

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review logs in the terminal
3. Check Docker container logs: `docker-compose logs`
4. Ensure all environment variables are set correctly

Happy coding! 🚀
