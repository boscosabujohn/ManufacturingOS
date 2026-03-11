# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy built assets from builder
COPY --from=builder /app/dist ./dist

# Create a non-root user for security
# Alpine already has a 'node' user
USER node

# Expose backend port
EXPOSE 8000

# Health check using Terminus endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
  CMD node -e "fetch('http://localhost:8000/health').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

# Run the application
CMD ["node", "dist/main"]
