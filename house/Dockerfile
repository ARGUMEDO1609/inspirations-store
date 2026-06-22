# syntax=docker/dockerfile:1
# Multi-stage image for the React + Vite frontend.
# Node pinned to 24 to match the local environment (v24.x).
#
#   target "dev"  -> Vite dev server with HMR (used by docker-compose.yml)
#   target "prod" -> static build served by nginx (used by docker-compose.prod.yml)

ARG NODE_VERSION=24

# ---- Base with dependencies -------------------------------------------------
FROM docker.io/library/node:${NODE_VERSION}-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- Development target (hot reload) ----------------------------------------
FROM deps AS dev
WORKDIR /app
ENV NODE_ENV=development
# Source is bind-mounted in compose; this copy is just a baseline.
COPY . .
EXPOSE 5173
# --host exposes the dev server outside the container.
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]

# ---- Build stage ------------------------------------------------------------
FROM deps AS build
WORKDIR /app
# VITE_* vars are baked at build time; pass via build-arg in compose.
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
COPY . .
RUN npm run build

# ---- Production target (nginx) ----------------------------------------------
FROM docker.io/library/nginx:1.27-alpine AS prod
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
