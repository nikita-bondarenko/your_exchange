# Simple production Dockerfile for Cryptus
FROM node:18-alpine

# Install system dependencies
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Set environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN pnpm run build

# Create nextjs user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set permissions
RUN chown -R nextjs:nodejs /app

# Switch to nextjs user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start application
CMD ["pnpm", "start"] 