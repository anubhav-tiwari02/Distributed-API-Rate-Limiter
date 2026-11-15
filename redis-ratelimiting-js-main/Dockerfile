
FROM oven/bun:1.2-alpine AS base
WORKDIR /usr/src/app

# Install development and production dependencies
FROM base AS install

RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# Development stage
FROM base AS dev
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# Build application
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

ENV NODE_ENV=production
RUN bun build --target=bun . --outdir build/

# Production stage
FROM base AS release

COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/build/server/index.js ./server/index.js
COPY --from=prerelease /usr/src/app/server/views ./server/views
COPY --from=prerelease /usr/src/app/public ./public
COPY --from=prerelease /usr/src/app/package.json ./package.json

USER bun
EXPOSE 8080

ENTRYPOINT ["bun", "server/index.js"]
