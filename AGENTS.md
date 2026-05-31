# AGENTS.md — ZENIT CONSULTING GROUP

## Architecture

Projet statique HTML avec Netlify Functions (TypeScript) pour le backend.

```
/
├── index.html              # Site principal (toutes sections)
├── admin.html              # Panneau admin (ajouter/supprimer projets)
├── netlify.toml            # Config Netlify (publish dir, function dir)
├── package.json
├── tsconfig.json
├── drizzle.config.ts       # Pointe migrations vers netlify/database/migrations/
├── db/
│   ├── schema.ts           # Schéma Drizzle (table projects)
│   └── index.ts            # Client Drizzle (drizzle-orm/netlify-db)
└── netlify/
    ├── functions/
    │   ├── projects.ts     # GET/POST /api/projects, DELETE /api/projects/:id
    │   ├── upload.ts       # POST /api/upload (stockage Blobs)
    │   └── media.ts        # GET /api/media?key=... (sert les blobs)
    └── database/
        └── migrations/     # Migrations SQL auto-appliquées par Netlify
```

## Table de données : `projects`

| Colonne | Type | Description |
|---------|------|-------------|
| id | serial PK | Identifiant auto |
| title | text | Titre du projet |
| description | text | Description |
| category | text | Catégorie (ex: Levés topographiques) |
| location | text | Localisation géographique du projet |
| project_date | text | Date ou période (texte libre) |
| media_keys | text | JSON array de clés Blobs |
| cover_key | text | Clé Blobs de l'image de couverture |
| created_at | timestamp | Date de création |

## Authentification admin

Simple clé secrète via variable d'environnement `ADMIN_PASSWORD`. Toutes les routes d'écriture (`POST`, `DELETE`) vérifient le header `X-Admin-Key`.

## Stockage médias

Les fichiers uploadés sont stockés dans Netlify Blobs (store: `project-media`). Les clés suivent le format `projects/{timestamp}-{random}.{ext}`. Servis via `/api/media?key=...`.

## Conventions

- Fonctions en TypeScript ES modules (`.ts`)
- Imports avec extension `.js` pour la compatibilité ESM
- `drizzle-kit@beta` et `drizzle-orm@beta` requis (adapteur Netlify uniquement en beta)
- Ajouter `npx drizzle-kit generate` après tout changement de schéma

## Ajouter une colonne

1. Modifier `db/schema.ts`
2. Exécuter `npx drizzle-kit generate`
3. Déployer — Netlify applique la migration automatiquement
