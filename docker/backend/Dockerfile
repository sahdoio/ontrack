# ========================================
# Development Stage
# ========================================
FROM node:23.11.1-alpine AS development

WORKDIR /app

COPY apps/core/package*.json ./

RUN npm install

COPY apps/core/ ./

EXPOSE 3000

CMD ["npm", "run", "start:dev"]


# ========================================
# Builder Stage (for production builds)
# ========================================
FROM node:23.11.1-alpine AS builder

WORKDIR /app

COPY apps/core/package*.json ./

RUN npm install

COPY apps/core/ ./

RUN npm run build

RUN npm ci --only=production && npm cache clean --force


# ========================================
# Production Stage (not used for local dev)
# ========================================
FROM node:23.11.1-alpine AS production

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY apps/core/package*.json ./

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

USER nestjs

EXPOSE 3000

CMD ["node", "dist/main"]
