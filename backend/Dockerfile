# Étape 1 : Construction de l'application
FROM node:20-slim AS builder

# Définir le dossier de travail
WORKDIR /usr/src/app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances en production uniquement
RUN npm install --production

# Copier tout le reste de l'application
COPY . .

# Étape 2 : Image finale pour exécuter l'application
FROM node:20-slim

# Définir le dossier de travail
WORKDIR /usr/src/app

# Copier uniquement le build final depuis l'étape builder
COPY --from=builder /usr/src/app .

# Exposer le port de l'application
EXPOSE 3000

# Lancer ton application
CMD ["npm", "start"]
