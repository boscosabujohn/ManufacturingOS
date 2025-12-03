#!/bin/bash

# System Verification Script
echo "🔍 FactOS ERP - System Verification"
echo "======================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_check() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

# Check Docker
docker --version > /dev/null 2>&1
print_check $? "Docker installed"

docker-compose --version > /dev/null 2>&1
print_check $? "Docker Compose installed"

# Check Node & npm
node --version > /dev/null 2>&1
print_check $? "Node.js installed ($(node --version))"

npm --version > /dev/null 2>&1
print_check $? "npm installed ($(npm --version))"

# Check dependencies
[ -d "backend/node_modules" ]
print_check $? "Backend dependencies installed"

[ -d "frontend/node_modules" ]
print_check $? "Frontend dependencies installed"

# Check environment files
[ -f "backend/.env" ]
print_check $? "Backend .env file exists"

[ -f "frontend/.env.local" ]
print_check $? "Frontend .env.local file exists"

# Check key packages
cd frontend
npm list tailwindcss-animate > /dev/null 2>&1
print_check $? "tailwindcss-animate installed"
cd ..

echo ""
echo "📊 System Status Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━"

# Count checks
TOTAL=8
PASSED=$(docker --version > /dev/null 2>&1 && echo 1 || echo 0)
PASSED=$((PASSED + $(docker-compose --version > /dev/null 2>&1 && echo 1 || echo 0)))
PASSED=$((PASSED + $(node --version > /dev/null 2>&1 && echo 1 || echo 0)))
PASSED=$((PASSED + $(npm --version > /dev/null 2>&1 && echo 1 || echo 0)))
PASSED=$((PASSED + $([ -d "backend/node_modules" ] && echo 1 || echo 0)))
PASSED=$((PASSED + $([ -d "frontend/node_modules" ] && echo 1 || echo 0)))
PASSED=$((PASSED + $([ -f "backend/.env" ] && echo 1 || echo 0)))
PASSED=$((PASSED + $([ -f "frontend/.env.local" ] && echo 1 || echo 0)))

echo "Checks passed: $PASSED/$TOTAL"

if [ $PASSED -eq $TOTAL ]; then
    echo -e "${GREEN}🎉 All systems ready for development!${NC}"
    echo ""
    echo "🚀 To start development, run:"
    echo "   ./start.sh"
    echo ""
    echo "📚 Or see QUICK_START.md for more options"
else
    echo -e "${RED}⚠️  Some checks failed. Please review above.${NC}"
    echo ""
    echo "💡 Try running: ./dev-start.sh for automatic setup"
fi

echo ""
