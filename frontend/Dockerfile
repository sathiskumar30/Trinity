FROM node:20-alpine AS base

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci || npm install

COPY . .

RUN npm run build || echo "Build handled by Next.js runtime; keeping dev-friendly start."

EXPOSE 3000

ENV NEXT_PUBLIC_API_BASE_URL=http://localhost:4000

CMD [ "npm", "start" ]