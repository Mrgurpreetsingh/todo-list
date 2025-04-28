# Étape de construction pour Vite
FROM node:20-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

RUN npm run build

# Étape pour Nginx
FROM nginx:alpine

# Copier la configuration Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copier le dossier de build Vite dans le répertoire Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Exposer le port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
