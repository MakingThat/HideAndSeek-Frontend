# Stage 1: Build the app
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy build files (adjust 'dist' to 'build' if your framework outputs to /build)
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 6767
CMD ["nginx", "-g", "daemon off;"]
