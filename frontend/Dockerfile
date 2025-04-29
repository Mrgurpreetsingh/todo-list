# frontend/Dockerfile

# Phase de build avec Node.js
FROM node:20.17-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Phase de production avec Nginx
FROM nginx:alpine

# Copier le build généré par la phase précédente
COPY --from=builder /app/dist /usr/share/nginx/html

# Copier la configuration Nginx et les certificats SSL
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./certs /etc/nginx/certs

# Donner les permissions nécessaires à l'utilisateur nginx
RUN chown -R nginx:nginx /usr/share/nginx/html

# Exposer les ports
EXPOSE 80 443

# Commande pour démarrer Nginx en mode premier plan
CMD ["nginx", "-g", "daemon off;"]