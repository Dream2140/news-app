FROM node:22-alpine AS base
RUN corepack enable pnpm

WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json tsconfig.base.json ./
COPY packages/shared/package.json packages/shared/
COPY apps/api/package.json apps/api/

RUN pnpm install --frozen-lockfile

COPY packages/shared packages/shared
COPY apps/api apps/api

RUN pnpm --filter @newsapp/api build

RUN mkdir -p apps/api/uploads

EXPOSE 5001

CMD ["node", "apps/api/dist/main.js"]
