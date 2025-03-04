FROM node:23-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN corepack enable pnpm && \ 
  pnpm install --frozen-lockfile


FROM --platform=$BUILDPLATFORM node:23-alpine AS builder
WORKDIR /app
ENV BUILD_CONTEXT=docker
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN mv .env.example .env && \
  corepack enable pnpm && \
  yarn prisma generate && \
  yarn next build && \
  rm -rf .env


FROM node:23-alpine AS runner
WORKDIR /app

RUN addgroup -g 1001 -S nodejs
RUN adduser -u 1001 -S nextjs

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js

USER nextjs
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["yarn", "next", "start"]
