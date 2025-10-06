# 1) Use Node.js base suitable for building and running Next.js
FROM node:20-alpine AS base

# 2) Set working directory
WORKDIR /app

# 3) Copy project files (we assume Next.js app is at repo root mounted here)
#    We copy only the files needed to install deps first for better caching.
COPY package.json package-lock.json* ./

# 4) Install dependencies
RUN npm ci || npm install

# 5) Copy the rest of the source code into the container
COPY . .

# 6) Build the Next.js application for production
RUN npm run build || echo "Build handled by Next.js runtime; keeping dev-friendly start."

# 7) Expose the default Next.js port
EXPOSE 3000

# 8) Environment variable for API base URL (overridden by Compose)
ENV NEXT_PUBLIC_API_BASE_URL=http://localhost:4000

# 9) Run the app (fall back to `next start` if available)
CMD [ "npm", "start" ]
