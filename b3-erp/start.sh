#!/bin/bash

# Quick Start Script - Starts everything with one command

echo "🚀 Starting FactOS ERP Development Environment..."

# Start Docker services
echo "📦 Starting Docker services (PostgreSQL & Redis)..."
docker-compose up -d postgres redis

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 8

# Check if services are running
if ! docker ps | grep -q "b3-erp-postgres"; then
    echo "❌ PostgreSQL failed to start"
    exit 1
fi

echo "✅ Docker services are ready!"
echo ""
echo "🌐 Access URLs:"
echo "   Frontend:  http://localhost:3000"
echo "   Backend:   http://localhost:5000/api/v1"
echo "   API Docs:  http://localhost:5000/api/docs"
echo ""
echo "Starting development servers..."
echo "Press Ctrl+C to stop all services"
echo ""

# Start backend in background and frontend in foreground
cd backend && npm run start:dev &
BACKEND_PID=$!

# Give backend time to start
sleep 3

cd ../frontend && npm run dev

# Clean up on exit
kill $BACKEND_PID 2>/dev/null
