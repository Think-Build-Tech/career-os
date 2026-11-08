# =========================================================
# CareerOS API Service Dockerfile (Node.js 22 + TypeScript)
# =========================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy root workspace configurations
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml nx.json tsconfig.base.json ./
COPY apps/api ./apps/api
COPY libs ./libs

# Install all workspace dependencies
RUN pnpm install --frozen-lockfile

# Build api project
RUN pnpm exec nx build api --configuration=production

# Copy schema.sql to dist
RUN cp apps/api/src/app/config/schema.sql dist/apps/api/schema.sql || true

# Runner Stage
FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000
ENV HOST=0.0.0.0

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/package.json

# Install production dependencies
RUN pnpm install --prod --ignore-scripts

# Copy built artifacts from builder
COPY --from=builder /app/dist/apps/api ./dist/apps/api
COPY --from=builder /app/apps/api/src/app/config/schema.sql ./dist/apps/api/schema.sql
COPY --from=builder /app/apps/api/src/app/config/schema.sql /app/schema.sql

EXPOSE 5000

CMD ["node", "dist/apps/api/main.js"]

