# Étape 1 - Builder Vite
FROM node:20-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Étape 2 - Serveur Nginx
FROM nginx:alpine

# Copier la config Nginx personnalisée (si tu en as une)
COPY nginx.conf /etc/nginx/nginx.conf

# Copier les fichiers build Vite dans Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

# Lancer nginx
CMD ["nginx", "-g", "daemon off;"]
