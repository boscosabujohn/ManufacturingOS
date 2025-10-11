#!/bin/bash

# Frontend-Only Development Script
# Perfect for UI/UX development without backend dependency

echo "🎨 Starting Frontend Development (UI/UX Mode)"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if in correct directory
if [ ! -d "frontend" ]; then
    echo "❌ Please run from b3-erp root directory"
    exit 1
fi

# Check dependencies
if [ ! -d "frontend/node_modules" ]; then
    echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
    cd frontend && npm install && cd ..
fi

echo -e "${GREEN}✅ Frontend dependencies ready${NC}"
echo ""
echo -e "${BLUE}🚀 Starting Next.js development server...${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🌐 Frontend URL:  http://localhost:3000"
echo "  📱 Dashboard:     http://localhost:3000/dashboard"
echo "  🎨 Focus:         UI/UX Development"
echo "  📝 Mode:          Frontend Only (No Backend needed)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${YELLOW}💡 Tip: You can develop UI components without backend${NC}"
echo -e "${YELLOW}   API calls will show loading states or mock data${NC}"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start frontend
cd frontend && npm run dev
