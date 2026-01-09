# Build stage
FROM node:20-alpine as build

WORKDIR /app

# Accept build argument for API URL
ARG VITE_API_URL=https://api.example.com

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application with API URL
RUN VITE_API_URL=$VITE_API_URL npm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
