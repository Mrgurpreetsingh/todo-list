
# Todo List

Une application moderne et sécurisée pour gérer vos tâches quotidiennes. Organisez vos activités, attribuez des priorités, et suivez vos progrès avec une interface simple et intuitive.

## Table des matières
- [Aperçu](#aperçu)
- [Fonctionnalités](#fonctionnalités)
- [Technologies](#technologies)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [Tests](#tests)
- [Contribuer](#contribuer)
- [Licence](#licence)

## Aperçu
**Todo List** est une application web full-stack qui permet aux utilisateurs de créer, gérer, et organiser leurs tâches. Elle inclut une authentification sécurisée, une gestion des priorités, et une interface utilisateur réactive. L'application est conçue pour être déployée localement avec Docker, facilitant le développement et les tests.

## Fonctionnalités
- **Gestion des tâches** :
  - Ajouter une nouvelle tâche avec titre, description, et priorité (basse, moyenne, haute).
  - Modifier les détails d'une tâche existante (titre, description, priorité, statut).
  - Marquer une tâche comme terminée ou incomplète.
  - Supprimer une tâche.
- **Authentification sécurisée** :
  - Inscription et connexion des utilisateurs avec JWT (JSON Web Tokens).
  - Mise à jour du profil utilisateur (nom, prénom).
- **Interface utilisateur** :
  - Design réactif pour une utilisation sur desktop et mobile.
  - Affichage des tâches avec indicateurs visuels pour les tâches terminées.
- **Gestion des priorités** :
  - Attribution de niveaux de priorité (basse, moyenne, haute) aux tâches.
- **Persistance des données** :
  - Stockage des tâches et des utilisateurs dans une base de données MySQL.

## Technologies
- **Frontend** :
  - React.js
  - Axios pour les requêtes API
  - CSS personnalisé pour le style
- **Backend** :
  - Node.js avec Express.js
  - MySQL pour la base de données
  - JWT pour l'authentification
- **Infrastructure** :
  - Docker et Docker Compose pour le déploiement
  - Nginx comme serveur web pour le frontend
- **Outils** :
  - Postman pour tester les API
  - Morgan et Winston pour la journalisation

## Prérequis
Avant de commencer, assurez-vous d'avoir installé :
- [Node.js](https://nodejs.org/) (v20 ou supérieur)
- [Docker](https://www.docker.com/) et [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/)
- Un terminal (ex. Bash, PowerShell, ou Terminal macOS)
- [Postman](https://www.postman.com/) (optionnel, pour tester les API)

## Installation
1. **Cloner le dépôt** :
   ```bash
   git clone https://github.com/Mrgurpreetsingh/todo-list.git
   cd todo-list
   ```

2. **Installer les dépendances** :
   - Pour le backend :
     ```bash
     cd backend
     npm install
     cd ..
     ```
   - Pour le frontend :
     ```bash
     cd frontend
     npm install
     cd ..
     ```

3. **Configurer Docker** :
   - Assurez-vous que Docker est en cours d'exécution.
   - Le fichier `docker-compose.yml` configure trois services : `frontend`, `backend`, et `db`.

## Configuration
1. **Configurer les variables d'environnement** :
   - Créez un fichier `.env` dans le dossier `backend` avec les variables suivantes :
     ```env
     NODE_ENV=development
     PORT=3000
     DB_HOST=db
     DB_USER=root
     DB_PASSWORD=rootpassword
     DB_NAME=todo_users
     JWT_SECRET=votre_secret_jwt_ici
     ```
   - Remplacez `votre_secret_jwt_ici` par une chaîne sécurisée (ex. générée avec `openssl rand -base64 32`).

2. **Initialiser la base de données** :
   - Le fichier `init.sql` (dans `backend/db`) crée les tables `users`, `tache`, et `priorite`.
   - Assurez-vous qu'il est monté dans `docker-compose.yml` :
     ```yaml
     volumes:
       - ./backend/db/init.sql:/docker-entrypoint-initdb.d/init.sql
     ```

3. **Vérifier les certificats SSL** :
   - Les certificats auto-signés pour HTTPS sont dans `frontend/certs`.
   - Si vous utilisez vos propres certificats, mettez à jour `frontend/nginx.conf` et `frontend/certs`.

## Utilisation
1. **Lancer l'application** :
   ```bash
   docker-compose up -d --build
   ```
   - Cela construit et démarre les conteneurs pour le frontend, le backend, et la base de données.

2. **Accéder à l'application** :
   - Ouvrez votre navigateur à `https://localhost`.
   - Acceptez le certificat auto-signé si nécessaire.

3. **Interagir avec l'application** :
   - **Inscription/Connexion** : Créez un compte ou connectez-vous via `/login`.
   - **Gestion des tâches** : Accédez à `/taches` pour ajouter, modifier, ou supprimer des tâches.
   - **Profil** : Mettez à jour vos informations personnelles via `/profile`.

4. **Arrêter l'application** :
   ```bash
   docker-compose down
   ```

## Tests
Pour tester les API, utilisez les commandes cURL ou Postman.

### Tests avec cURL
Exécutez les commandes suivantes dans un terminal. Remplacez `<votre_token>` par un JWT valide obtenu après connexion.

1. **Créer une tâche** :
   ```bash
   curl -X POST https://localhost/api/tasks \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <votre_token>" \
     -d '{"titre":"Tâche Test","description":"Ceci est un test","priorite_id":2}' \
     --insecure
   ```

2. **Lister les tâches** :
   ```bash
   curl -X GET https://localhost/api/tasks \
     -H "Authorization: Bearer <votre_token>" \
     --insecure
   ```

3. **Récupérer une tâche** :
   ```bash
   curl -X GET https://localhost/api/tasks/<id_tache> \
     -H "Authorization: Bearer <votre_token>" \
     --insecure
   ```

4. **Mettre à jour une tâche** :
   ```bash
   curl -X PUT https://localhost/api/tasks/<id_tache> \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <votre_token>" \
     -d '{"titre":"Tâche Mise à Jour","est_complete":1}' \
     --insecure
   ```

5. **Supprimer une tâche** :
   ```bash
   curl -X DELETE https://localhost/api/tasks/<id_tache> \
     -H "Authorization: Bearer <votre_token>" \
     --insecure
   ```

### Tests avec Postman
1. Importez la collection Postman fournie dans `docs/Todo_List_API_Taches.postman_collection.json` (ou créez-la manuellement, voir ci-dessous).
2. Configurez l'environnement avec :
   - `tacheId` : (vide initialement, rempli par le test POST).
3. Exécutez les requêtes dans l'ordre : POST, GET, GET/:id, PUT, DELETE.

**Exemple de collection Postman** :
- **POST /api/tasks** : Crée une tâche et stocke `id_tache`.
- **GET /api/tasks** : Vérifie que la réponse est un tableau.
- **GET /api/tasks/{{tacheId}}** : Vérifie l'`id_tache`.
- **PUT /api/tasks/{{tacheId}}** : Vérifie la mise à jour.
- **DELETE /api/tasks/{{tacheId}}** : Vérifie la suppression.

## Contribuer
Les contributions sont les bienvenues ! Pour contribuer :
1. Forkez le dépôt.
2. Créez une branche : `git checkout -b feature/votre-fonctionnalite`.
3. Commitez vos changements : `git commit -m "Ajout de votre-fonctionnalite"`.
4. Poussez vers la branche : `git push origin feature/votre-fonctionnalite`.
5. Ouvrez une Pull Request.

Veuillez respecter les conventions de codage et inclure des tests pour les nouvelles fonctionnalités.

## Licence
Ce projet est sous licence [MIT](LICENSE). Voir le fichier `LICENSE` pour plus de détails.

---

### Notes
- **Personnalisation** : J'ai supposé que le dépôt GitHub est `https://github.com/Mrgurpreetsingh/todo-list.git`. Remplacez-le par l'URL correcte si nécessaire.
- **Améliorations** : Ajout de sections pour les technologies, les tests, et les contributions pour rendre le README plus complet.
- **Problèmes connus** : L'erreur `404` sur `PUT /api/users/me` n'est pas mentionnée, car elle est en cours de résolution. Si elle persiste, incluez une note dans une section "Problèmes connus".
- **Fichier Postman** : Si vous souhaitez que je fournisse le JSON exact de la collection Postman, faites-le-moi savoir.

**Action** :
1. Créez ou mettez à jour `README.md` à la racine de votre projet avec ce contenu :
   ```bash
   echo '# Todo List ...' > README.md
   ```
   (Collez le contenu ci-dessus dans `README.md` avec un éditeur comme VS Code.)
2. Vérifiez le contenu :
   ```bash
   cat README.md
   ```
3. Poussez les changements vers GitHub :
   ```bash
   git add README.md
   git commit -m "Mise à jour du README"
   git push origin main
   ```

