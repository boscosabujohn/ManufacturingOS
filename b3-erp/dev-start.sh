#!/bin/bash

# ManufacturingOS ERP - Development Startup Script
# This script prepares and starts the development environment

set -e

echo "🚀 ManufacturingOS ERP - Development Setup"
echo "===================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    print_error "Please run this script from the b3-erp root directory"
    exit 1
fi

# Check Docker
echo "1️⃣  Checking Docker..."
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi
print_success "Docker is installed ($(docker --version))"

# Check Docker Compose
echo ""
echo "2️⃣  Checking Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi
print_success "Docker Compose is installed ($(docker-compose --version))"

# Check Node.js
echo ""
echo "3️⃣  Checking Node.js..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi
print_success "Node.js is installed ($(node --version))"

# Check npm
echo ""
echo "4️⃣  Checking npm..."
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi
print_success "npm is installed ($(npm --version))"

# Check if dependencies are installed
echo ""
echo "5️⃣  Checking dependencies..."

if [ ! -d "backend/node_modules" ]; then
    print_warning "Backend dependencies not installed. Installing..."
    cd backend && npm install && cd ..
    print_success "Backend dependencies installed"
else
    print_success "Backend dependencies already installed"
fi

if [ ! -d "frontend/node_modules" ]; then
    print_warning "Frontend dependencies not installed. Installing..."
    cd frontend && npm install && cd ..
    print_success "Frontend dependencies installed"
else
    print_success "Frontend dependencies already installed"
fi

# Check environment files
echo ""
echo "6️⃣  Checking environment files..."

if [ ! -f "backend/.env" ]; then
    print_warning "Backend .env file not found. Creating from .env.example..."
    cp backend/.env.example backend/.env
    print_success "Backend .env file created"
else
    print_success "Backend .env file exists"
fi

if [ ! -f "frontend/.env.local" ]; then
    print_warning "Frontend .env.local file not found. Creating..."
    cat > frontend/.env.local << 'EOF'
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_API_TIMEOUT=30000

# WebSocket Configuration
NEXT_PUBLIC_WS_URL=ws://localhost:5000

# App Configuration
NEXT_PUBLIC_APP_NAME=ManufacturingOS ERP
NEXT_PUBLIC_APP_VERSION=1.0.0

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_DEBUG=true
EOF
    print_success "Frontend .env.local file created"
else
    print_success "Frontend .env.local file exists"
fi

# Check if Docker services are running
echo ""
echo "7️⃣  Checking Docker services..."

if docker ps | grep -q "b3-erp-postgres"; then
    print_success "PostgreSQL is already running"
else
    print_warning "PostgreSQL is not running. Starting Docker services..."
    docker-compose up -d postgres redis
    print_info "Waiting for PostgreSQL to be ready (10 seconds)..."
    sleep 10
    print_success "Docker services started"
fi

# Summary
echo ""
echo "============================================"
print_success "Development environment is ready!"
echo "============================================"
echo ""

# Display access information
echo "📊 Access Information:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🌐 Frontend:         http://localhost:3000"
echo "  🔧 Backend API:      http://localhost:5000/api/v1"
echo "  📚 API Docs:         http://localhost:5000/api/docs"
echo "  🗄️  PostgreSQL:       localhost:5432 (postgres/postgres)"
echo "  🔴 Redis:            localhost:6379"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Ask user what they want to do
echo "What would you like to do?"
echo "  1) Start backend only"
echo "  2) Start frontend only"
echo "  3) Start both (backend + frontend)"
echo "  4) Exit (services are running)"
echo ""
read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        print_info "Starting backend..."
        cd backend && npm run start:dev
        ;;
    2)
        print_info "Starting frontend..."
        cd frontend && npm run dev
        ;;
    3)
        print_info "Starting both backend and frontend..."
        print_info "Backend will run in the background. Check logs with: docker-compose logs -f backend"
        docker-compose up -d backend
        sleep 3
        cd frontend && npm run dev
        ;;
    4)
        print_info "Docker services are running. You can start dev servers manually:"
        echo "  Backend:  cd backend && npm run start:dev"
        echo "  Frontend: cd frontend && npm run dev"
        echo ""
        print_info "To stop Docker services: make docker-down"
        ;;
    *)
        print_error "Invalid choice. Exiting."
        exit 1
        ;;
esac
