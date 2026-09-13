# Debian-based (glibc) image so better-sqlite3 can use its prebuilt binary
# instead of needing a C++ toolchain to compile from source.
FROM node:20-bullseye-slim

WORKDIR /app

COPY package.json package-lock.json ./
COPY server/package.json server/package.json
COPY client/package.json client/package.json

RUN npm ci

COPY . .

RUN npm run build --workspace=client

ENV NODE_ENV=production

CMD ["node", "server/src/index.js"]
