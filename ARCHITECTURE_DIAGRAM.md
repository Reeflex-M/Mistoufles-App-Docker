# 📊 Diagrammes pour Google Slides

## 1. Architecture Docker (à recréer dans Google Slides)

```
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│                     │    │                     │    │                     │
│      FRONTEND       │    │       BACKEND       │    │       MYSQL         │
│      (React)        │    │      (Django)       │    │     (Database)      │
│                     │    │                     │    │                     │
│    Node.js 18       │◄──►│    Python 3.11      │◄──►│     MySQL 8.0       │
│    Port: 5173       │    │    Port: 8000       │    │    Port: 3306       │
│                     │    │                     │    │                     │
└─────────────────────┘    └─────────────────────┘    └─────────────────────┘
```

**Instructions Google Slides :**

- Insérer → Formes → Rectangle arrondi (3 rectangles)
- Ajouter texte dans chaque rectangle
- Insérer → Ligne → Flèches bidirectionnelles
- Couleurs : Frontend (vert), Backend (bleu), Database (orange)

---

## 2. Comparaison Avant/Après (Tableau Google Slides)

| **AVANT Docker**     | **APRÈS Docker**       |
| -------------------- | ---------------------- |
| ❌ Installer Python  | ✅ `docker-compose up` |
| ❌ Installer Node.js | ✅ Tout automatique    |
| ❌ Installer MySQL   | ✅ ~3 minutes          |
| ❌ Config manuelle   | ✅ Reproductible       |
| ❌ ~30 minutes       | ✅ 1 commande          |

**Instructions :**

- Insérer → Tableau → 2 colonnes, 6 lignes
- Copier-coller le contenu

---

## 3. Flux de déploiement

```
1. Clone projet
      ↓
2. docker-compose up --build
      ↓
3. Services démarrés
      ↓
4. Application prête
```

**Instructions :**

- Insérer → Formes → Rectangle (4 boîtes)
- Insérer → Ligne → Flèches vers le bas
- Couleur dégradé du rouge au vert

---

## 4. Problèmes → Solutions

```
Problème MySQL     →  Dépendances système
Erreur Rollup      →  node:18 standard
Conflits Python    →  requirements_clean.txt
Icônes manquantes  →  @mui/icons-material
```

**Instructions :**

- Utiliser des puces avec flèches
- Couleur rouge pour problèmes, vert pour solutions
