# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

# Permet d'injecter VITE_API_URL au build-time si besoin
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY . .
RUN VITE_BASE=/ npm run build

# Serve stage
FROM nginx:alpine

# Copie des fichiers buildés
COPY --from=builder /app/dist /usr/share/nginx/html

# Copie du template de configuration Nginx
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Copie du script de démarrage
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["/docker-entrypoint.sh"]
