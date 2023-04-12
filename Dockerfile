FROM node:16-alpine AS build

WORKDIR /app

# Dependencies
COPY package*.json ./
RUN npm ci

# Build
COPY . .
RUN npm run build
RUN npm run esbuild

# Create run image
FROM node:16-alpine as prod

WORKDIR /app

# Copy exec scripts
COPY --from=build /app/node_modules/@nestjs /app/node_modules/@nestjs
COPY --from=build /app/node_modules/pg /app/node_modules/pg
COPY --from=build /app/cart-service.js /app

# Application
USER node
ENV PORT=8080
ENV NODE_ENV=production
EXPOSE 8080

CMD ["node", "cart-service.js"]
