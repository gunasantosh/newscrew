# Use official Node.js image
FROM node:20.14.0-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json first, then install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy remaining project files and build
COPY . .
RUN npm run build

# Debug: Check if the dist folder exists
RUN ls -l /app/dist

# Use Nginx to serve the built files
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
