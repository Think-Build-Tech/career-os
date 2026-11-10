# =========================================================
# CareerOS API Service Dockerfile (Node.js 22 + TypeScript)
# =========================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@11.14.0 --activate

# Copy root workspace configurations
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml nx.json tsconfig.base.json ./
COPY apps/api ./apps/api
COPY libs ./libs
COPY tools/scripts/seed_database.js ./tools/scripts/seed_database.js

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

# Copy built artifacts from builder
COPY --from=builder /app/dist/apps/api ./dist/apps/api
COPY --from=builder /app/apps/api/src/app/config/schema.sql ./dist/apps/api/schema.sql
COPY --from=builder /app/apps/api/src/app/config/schema.sql /app/schema.sql
COPY --from=builder /app/tools/scripts/seed_database.js ./dist/apps/api/seed_database.js

# Nx generates a pruned package manifest for the bundled API. Install only the
# runtime dependencies beside the built entrypoint; the source workspace is
# not needed in the runner image.
RUN corepack enable && corepack prepare pnpm@11.14.0 --activate \
    && cd /app/dist/apps/api \
    && pnpm install --prod --ignore-scripts --no-frozen-lockfile

EXPOSE 5000

CMD ["node", "dist/apps/api/main.js"]

