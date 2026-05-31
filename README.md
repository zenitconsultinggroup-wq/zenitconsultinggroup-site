# ZENIT CONSULTING GROUP — Site Web

Site web officiel de ZENIT CONSULTING GROUP, cabinet expert en géomatique, topographie et services administratifs basé à Lomé, Togo.

## Technologies

- **Frontend** : HTML5, CSS3, JavaScript (vanilla) — site statique
- **Backend** : Netlify Functions (TypeScript/Node.js)
- **Base de données** : Netlify Database (PostgreSQL via Drizzle ORM)
- **Stockage médias** : Netlify Blobs (object storage)
- **Carte interactive** : Leaflet.js + OpenStreetMap

## Fonctionnalités

- Présentation des services de géomatique et topographie
- Section **Localisation** avec carte interactive montrant le bureau à Lomé, Togo
- Galerie **Projets** chargée dynamiquement depuis la base de données
- **Panneau admin** (`/admin.html`) pour gérer les projets et uploader les médias
- Formulaire de demande de service

## Démarrage local

```bash
npm install
netlify dev
```

Le site sera disponible sur `http://localhost:8888`.

## Configuration requise

Définir la variable d'environnement `ADMIN_PASSWORD` sur Netlify (Site settings > Environment variables) pour sécuriser le panneau admin.

## Admin

Accéder au panneau d'administration via `/admin.html`. Entrer le mot de passe défini dans `ADMIN_PASSWORD`.
