# ==========================================
# Stage 1 - Build React (Vite)
# ==========================================
FROM node:20-alpine AS builder

# Working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the Vite application
RUN npm run build

# ==========================================
# Stage 2 - Nginx
# ==========================================
FROM nginx:stable-alpine

# Remove default Nginx configuration
RUN rm -f /etc/nginx/conf.d/default.conf

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy Vite build output
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]