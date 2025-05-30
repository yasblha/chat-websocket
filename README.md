# Projet Chat WebSocket

Ce projet est une application de chat en temps réel utilisant WebSocket, construite avec un backend NestJS et un frontend Angular.

## Table des matières

- [Prérequis](#prérequis)
- [Installation](#installation)
- [Lancement du projet](#lancement-du-projet)
- [Fonctionnalités](#fonctionnalités)

## Prérequis

Assurez-vous d'avoir installé les éléments suivants :

- Node.js (avec npm ou yarn) et Docker Compose.
- Angular CLI (pour le frontend si vous le lancez séparément de Docker Compose).

## Installation

1. Clonez le dépôt :
   ```bash
   git clone <URL_DU_DEPOT>
   cd chat-websocket
   ```

2. **Backend (server)** :
   Naviguez vers le répertoire du backend :
   ```bash
   cd server
   ```
   Installez les dépendances :
   ```bash
   npm install # ou yarn install
   ```

3. **Frontend (front)** :
   Naviguez vers le répertoire du frontend :
   ```bash
   cd ../front
   ```
   Installez les dépendances :
   ```bash
   npm install # ou yarn install
   ```

## Configuration de la base de données avec Docker Compose

Le projet est configuré pour utiliser Docker Compose pour la base de données PostgreSQL. La synchronisation de la base de données est gérée automatiquement au lancement du backend grâce à `synchronize: true` dans la configuration TypeORM.

1. Naviguez vers le répertoire `server`.
2. Lancez le service de base de données défini dans votre `docker-compose.yml` (doit contenir un service 'postgres') :
   ```bash
   docker-compose up -d postgres
   ```
   Assurez-vous que le fichier `server/.env` (ou la configuration NestJS) pointe vers ce service (ex: `DATABASE_URL=postgresql://user:password@localhost:5432/mydatabase` si vous mappez le port 5432, ou le nom du service docker si les conteneurs communiquent entre eux).

## Lancement du projet

Vous pouvez lancer le projet de deux manières :

1. **Avec Docker Compose (si un fichier complet existe)** :
   Si un fichier `docker-compose.yml` à la racine du projet configure et lance le backend et le frontend :
   ```bash
   docker-compose up --build
   ```

2. **Manuellement (Backend et Frontend séparés)** :

   a. **Lancer le backend** :
      Dans le répertoire `server` :
      ```bash
      npm run start:dev # ou yarn start:dev
      ```
      Le backend devrait démarrer sur `http://localhost:3000` (ou le port configuré) et se connecter à la base de données Docker.

   b. **Lancer le frontend** :
      Dans le répertoire `front` :
      ```bash
      ng serve
      ```
      Le frontend devrait démarrer sur `http://localhost:4200` (ou le port configuré) et s'ouvrir dans votre navigateur.

## Fonctionnalités

- **Authentification** : Inscription et connexion des utilisateurs.
- **Chat en temps réel** : Envoyer et recevoir des messages instantanément via WebSocket.
- **Liste des utilisateurs connectés** : Voir quels utilisateurs sont actuellement en ligne.
- **Création de conversations** : Démarrer une conversation avec un autre utilisateur.
- **Recherche de messages** : Rechercher des messages spécifiques dans une conversation.


