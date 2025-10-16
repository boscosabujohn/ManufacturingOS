#!/bin/bash

# Script to add automatic page visit logging to Next.js pages
# Usage: ./scripts/add-page-logging.sh <page-path> <route-path>
# Example: ./scripts/add-page-logging.sh src/app/(modules)/sales/rfp/page.tsx /sales/rfp

set -e

FRONTEND_DIR="$(dirname "$0")/../frontend"
PAGE_FILE="$1"
ROUTE_PATH="$2"

if [ -z "$PAGE_FILE" ] || [ -z "$ROUTE_PATH" ]; then
    echo "Usage: $0 <page-file-path> <route-path>"
    echo "Example: $0 src/app/(modules)/sales/rfp/page.tsx /sales/rfp"
    exit 1
fi

FULL_PATH="$FRONTEND_DIR/$PAGE_FILE"

if [ ! -f "$FULL_PATH" ]; then
    echo "Error: File not found: $FULL_PATH"
    exit 1
fi

echo "Adding automatic logging to: $PAGE_FILE"
echo "Route path: $ROUTE_PATH"

# Check if already has logging
if grep -q "usePageVisitLogger" "$FULL_PATH"; then
    echo "✓ Page already has automatic logging enabled"
    exit 0
fi

# Create backup
cp "$FULL_PATH" "$FULL_PATH.backup"
echo "✓ Backup created: $FULL_PATH.backup"

# Check if it's a client component
if ! grep -q "'use client'" "$FULL_PATH"; then
    echo "✓ Adding 'use client' directive"
    # Add 'use client' at the top
    sed -i '' "1s/^/'use client';\n\n/" "$FULL_PATH"
fi

# Add import if not exists
if ! grep -q "usePageVisitLogger" "$FULL_PATH"; then
    echo "✓ Adding usePageVisitLogger import"
    # Find the last import line and add after it
    awk '/^import/ {last=NR} last==NR-1 && /^$/ {print "import { usePageVisitLogger } from '"'"'@/hooks/usePageVisitLogger'"'"';"; next} {print}' "$FULL_PATH" > "$FULL_PATH.tmp"
    mv "$FULL_PATH.tmp" "$FULL_PATH"
fi

# Add the hook call inside the component
echo "✓ Adding usePageVisitLogger hook call"
# This is a simple approach - you may need to manually adjust for complex components
sed -i '' "/export default function/a\\
\\
  // Automatically log page visits\\
  usePageVisitLogger('$ROUTE_PATH', true);\\
" "$FULL_PATH"

echo "✅ Automatic logging added successfully!"
echo ""
echo "To test:"
echo "1. Start the frontend: cd frontend && npm run dev"
echo "2. Visit: http://localhost:3001$ROUTE_PATH"
echo "3. Check console for: [Page Visit Logger] Logged visit to: $ROUTE_PATH"
echo ""
echo "If you need to revert: mv $FULL_PATH.backup $FULL_PATH"
