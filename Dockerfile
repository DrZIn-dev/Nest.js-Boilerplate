FROM node:14-alpine AS development
WORKDIR /usr/src/todo
COPY package*.json ./
RUN npm install -g pnpm
RUN apk add g++ make python3
RUN pnpm install
COPY . .
CMD ["sh", "start.sh"]


FROM node:14-alpine3.12 AS build
WORKDIR /usr/src/todo
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:14-alpine3.12 as production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/todo
COPY package*.json ./
RUN npm install --only=production
COPY . .
COPY --from=build /usr/src/todo/dist ./dist
CMD ["node", "dist/main"]