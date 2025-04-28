# Étape de construction : construction d'une image intermédiaire
FROM node:20-slim AS builder

# Répertoire de travail
WORKDIR /usr/src/app

# Copier les fichiers package*.json pour installer les dépendances
COPY package*.json ./

# Installer les dépendances de production
RUN apt-get update && apt-get install -y python3 make g++ && \
    apt-get upgrade -y && \
    npm ci --omit=dev

# Copier le code source de l'application
COPY . .

# Étape finale : image de production
FROM node:20-slim

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Copier les fichiers nécessaires depuis l'étape de construction
COPY --from=builder /usr/src/app .

# Exposer le port de l'application
EXPOSE 3000

# Lancer l'application
CMD ["node", "server.js"]
