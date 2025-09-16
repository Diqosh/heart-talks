# Stage 1 — build
FROM node:20-alpine AS builder
WORKDIR /app

# Copy only dependency files first for caching
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --silent

# Copy rest of the source code and build
COPY . .
RUN yarn build

# Stage 2 — serve with nginx
FROM nginx:stable-alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html

# Uncomment if you need custom SPA-friendly config
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]