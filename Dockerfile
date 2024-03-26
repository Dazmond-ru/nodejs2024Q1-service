FROM node:20-alpine AS development

USER node

WORKDIR /usr/src/app

COPY prisma package*.json ./

RUN npm ci && npx prisma generate && npm cache clean --force

COPY . .
