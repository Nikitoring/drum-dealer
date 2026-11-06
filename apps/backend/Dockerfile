FROM node:22-bookworm-slim AS deps

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
COPY apps/backend/package.json ./apps/backend/package.json
COPY apps/frontend/package.json ./apps/frontend/package.json
COPY apps/backend/prisma ./apps/backend/prisma

RUN npm ci
RUN npx prisma generate --schema apps/backend/prisma/schema.prisma

FROM deps AS builder

COPY . .
RUN npm run build --workspace=@drum-dealer/backend
RUN npm prune --omit=dev

FROM deps AS migrate

WORKDIR /app
CMD ["npx", "--no-install", "prisma", "migrate", "deploy", "--schema", "apps/backend/prisma/schema.prisma"]

FROM node:22-bookworm-slim AS runner

WORKDIR /app
ENV NODE_ENV=production

RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/apps/backend/package.json ./apps/backend/package.json
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/prisma ./apps/backend/prisma
COPY deploy/create-admin.js ./deploy/create-admin.js

EXPOSE 4000

CMD ["node", "apps/backend/dist/main.js"]
