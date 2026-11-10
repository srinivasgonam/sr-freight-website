# Production Dockerfile for S R Freight Fullstack Application
FROM node:24-alpine AS builder

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source and build static client assets
COPY . .
RUN pnpm run build

# Production runtime stage
FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# Copy server code and pre-built client dist
COPY server/ ./server/
COPY --from=builder /app/dist/ ./dist/

EXPOSE 5000

CMD ["node", "server/index.js"]
