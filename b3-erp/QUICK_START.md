# B3 MACBIS ERP - Quick Reference

## 🚀 Start Development (Fastest Way)

```bash
./start.sh
```

This will:
1. Start PostgreSQL and Redis
2. Start backend on http://localhost:5000
3. Start frontend on http://localhost:3000

## 📋 Common Commands

### Start Everything
```bash
./start.sh                    # Quick start (recommended)
./dev-start.sh               # Interactive start with options
make dev                     # Using Makefile
```

### Start Individual Services
```bash
# Backend only
cd backend && npm run start:dev

# Frontend only
cd frontend && npm run dev

# Database & Redis only
docker-compose up postgres redis
```

### Stop Services
```bash
# Stop dev servers: Ctrl+C
# Stop Docker: 
make docker-down
# or
docker-compose down
```

## 🌐 URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Dashboard & UI |
| Backend | http://localhost:5000/api/v1 | REST API |
| API Docs | http://localhost:5000/api/docs | Swagger UI |
| PostgreSQL | localhost:5432 | Database (user: postgres, pass: postgres) |
| Redis | localhost:6379 | Cache & Queue |

## 📁 Key Files

### Configuration
- `backend/.env` - Backend environment variables
- `frontend/.env.local` - Frontend environment variables
- `docker-compose.yml` - Docker services configuration
- `Makefile` - Development commands

### Code
- `backend/src/main.ts` - Backend entry point
- `backend/src/app.module.ts` - Backend module setup
- `frontend/src/app/(dashboard)/page.tsx` - Dashboard page
- `frontend/src/app/error.tsx` - Error pages

## 🛠️ Development Tools

### Build
```bash
cd backend && npm run build
cd frontend && npm run build
```

### Test
```bash
cd backend && npm run test
cd frontend && npm run test
```

### Lint & Format
```bash
cd backend && npm run lint
cd frontend && npm run lint
```

## 🐛 Troubleshooting

### Port in Use
```bash
# Kill process on port 3000 (frontend)
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Kill process on port 5000 (backend)
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Database Issues
```bash
# Restart database
docker-compose restart postgres

# View logs
docker-compose logs postgres

# Reset database (⚠️ deletes all data)
docker-compose down -v
docker-compose up -d postgres redis
```

### Clean Install
```bash
# Backend
cd backend && rm -rf node_modules package-lock.json && npm install

# Frontend
cd frontend && rm -rf node_modules package-lock.json && npm install
```

## 📦 Project Structure

```
b3-erp/
├── backend/           # NestJS backend
├── frontend/          # Next.js frontend
├── docker/            # Docker configs
├── docs/              # Documentation
├── start.sh           # Quick start script
├── dev-start.sh       # Interactive start
└── Makefile           # Make commands
```

## 🎯 Next Steps

1. ✅ **Setup Complete** - Dependencies installed, env configured
2. 🔄 **Run Dev Server** - Use `./start.sh`
3. 🌐 **Open Browser** - Visit http://localhost:3000
4. 👨‍💻 **Start Coding** - Implement module features
5. 🧪 **Test** - Write and run tests
6. 📦 **Build** - Create production build

## 📞 Help

For detailed setup: See `DEVELOPMENT_SETUP.md`
For issues: Check troubleshooting section above
For architecture: See `ARCHITECTURE.md`

Happy coding! 🎉
