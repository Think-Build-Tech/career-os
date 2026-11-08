# =========================================================
# CareerOS Web Frontend Dockerfile (Angular 19 + Nginx)
# =========================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy root workspace configurations
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml nx.json tsconfig.base.json ./
COPY apps/web ./apps/web
COPY libs ./libs

# Install all workspace dependencies
RUN pnpm install --frozen-lockfile

# Build Angular web project
RUN pnpm exec nx build web --configuration=production

# Nginx Production Serving Stage
FROM nginx:alpine AS runner

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy built angular assets
COPY --from=builder /app/dist/apps/web/browser /usr/share/nginx/html

# Copy custom nginx configuration
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

