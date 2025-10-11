.PHONY: help setup dev build test clean docker-up docker-down

help:
	@echo "Available commands:"
	@echo "  make setup       - Initial project setup"
	@echo "  make dev         - Start development servers"
	@echo "  make build       - Build for production"
	@echo "  make test        - Run tests"
	@echo "  make clean       - Clean build artifacts"
	@echo "  make docker-up   - Start Docker containers"
	@echo "  make docker-down - Stop Docker containers"

setup:
	@echo "Setting up backend..."
	cd backend && npm install
	cd backend && cp .env.example .env
	@echo "Setting up frontend..."
	cd frontend && npm install
	cd frontend && cp .env.local.example .env.local
	@echo "Setup complete! Please configure .env files"

dev:
	@echo "Starting development servers..."
	docker-compose up -d db redis
	@echo "Wait for database to be ready..."
	sleep 3
	@echo "Starting backend and frontend..."
	cd backend && npm run start:dev &
	cd frontend && npm run dev

build:
	@echo "Building backend..."
	cd backend && npm run build
	@echo "Building frontend..."
	cd frontend && npm run build

test:
	@echo "Running backend tests..."
	cd backend && npm run test
	@echo "Running frontend tests..."
	cd frontend && npm run test

clean:
	@echo "Cleaning build artifacts..."
	rm -rf backend/dist
	rm -rf frontend/.next
	rm -rf frontend/out
	@echo "Clean complete!"

docker-up:
	@echo "Starting Docker containers..."
	docker-compose up -d
	@echo "Containers started!"
	@echo "Backend: http://localhost:8000"
	@echo "Frontend: http://localhost:3000"
	@echo "API Docs: http://localhost:8000/api/docs"

docker-down:
	@echo "Stopping Docker containers..."
	docker-compose down
	@echo "Containers stopped!"

docker-logs:
	docker-compose logs -f

docker-restart:
	@echo "Restarting Docker containers..."
	docker-compose restart
