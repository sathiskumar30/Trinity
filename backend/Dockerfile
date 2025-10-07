
# 1) Use a small, secure base image with Node.js runtime
FROM node:20-alpine AS base

# 2) Create an app directory inside the container
WORKDIR /app

# 3) Copy only package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# 4) Install all dependencies
RUN npm install

# 5) Copy the rest of the application code
COPY backend/. .

# 6) Expose the backend port used by Express
EXPOSE 4000

# 7) Define environment variable defaults (can be overridden from Compose)
ENV PORT=4000

# 8) Start the server
CMD ["node", "server.js"]
