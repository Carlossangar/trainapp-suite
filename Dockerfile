# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY server/package*.json ./server/

# Install dependencies
RUN npm ci
RUN cd server && npm ci

# Copy source code
COPY . .

# Build frontend
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Install PM2 globally
RUN npm install -g pm2

# Copy server files and built frontend
COPY --from=builder /app/server ./server
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/ecosystem.config.js ./

# Create logs directory
RUN mkdir -p logs

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start application
CMD ["pm2-runtime", "start", "ecosystem.config.js"]