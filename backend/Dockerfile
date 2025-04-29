# backend/Dockerfile
FROM node:20-slim

WORKDIR /usr/src/app

# Copier les fichiers de dépendances
COPY package.json package-lock.json ./

# Installer les dépendances et recompiler bcrypt
RUN apt-get update && \
    apt-get install -y python3 make g++ && \
    npm install --production && \
    npm rebuild bcrypt --build-from-source && \
    npm audit fix --force && \
    apt-get purge -y python3 make g++ && \
    apt-get autoremove -y

# Copier le reste des fichiers
COPY . .

EXPOSE 3000

CMD ["npm", "start"]

