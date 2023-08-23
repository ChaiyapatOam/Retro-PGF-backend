FROM node:18-alpine AS node
RUN npm i -g pnpm
COPY . /app
WORKDIR /app

FROM node AS prod-deps
RUN pnpm install --prod --frozen-lockfile
RUN npx prisma generate

FROM node AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM node
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist

ENV PORT=8080
EXPOSE $PORT
CMD ["pnpm","start"]