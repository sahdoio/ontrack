FROM node:23.11.1-alpine AS development

WORKDIR /app

COPY apps/front/package*.json ./

RUN npm install

COPY apps/front/ ./

EXPOSE 3000

CMD ["npm", "run", "dev"]


FROM node:23.11.1-alpine AS builder

WORKDIR /app

COPY apps/front/package*.json ./

RUN npm install

COPY apps/front/ ./

RUN npm run build


FROM node:23.11.1-alpine AS production

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

USER nextjs

EXPOSE 3000

CMD ["npm", "run", "start"]
