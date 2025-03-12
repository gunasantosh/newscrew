# Use official Node.js image
FROM node:20.14.0-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first to ensure proper installation
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire project after installing dependencies
COPY . .

# Build the Vite project
RUN npm run build

# Use an official Nginx image to serve the built files
FROM nginx:alpine

# Copy built files from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
