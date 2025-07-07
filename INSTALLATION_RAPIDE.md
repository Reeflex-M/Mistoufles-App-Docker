# 🚀 Installation rapide - Les Mistoufles

## ⚡ **Installation en 2 minutes**

```bash
# 1. Cloner le projet
git clone [votre-repository]
cd Mistoufles-App

# 2. Lancer l'application (tout automatique !)
docker-compose up --build
```

## 🌐 **Accès à l'application**

Une fois que vous voyez "Starting development server", l'application est prête :

- **🖥️ Application** : http://localhost:5173
- **⚙️ Admin Django** : http://localhost:8000/admin

## 🔑 **Identifiants par défaut**

Un compte administrateur est créé automatiquement :

- **👤 Username** : `admin`
- **🔑 Password** : `mistoufles2024`
- **📧 Email** : `admin@mistoufles.fr`

> ⚠️ **Important** : Changez ce mot de passe après votre première connexion !

## 🛑 **Arrêter l'application**

```bash
# Arrêter les services
Ctrl + C

# Ou dans un autre terminal
docker-compose down
```

## 🔄 **Redémarrer l'application**

```bash
# Redémarrage rapide (garde les données)
docker-compose up

# Reconstruction complète (si problème)
docker-compose up --build
```

## 🆘 **Problèmes courants**

### Port déjà utilisé

```bash
# Changer les ports dans docker-compose.yml si nécessaire
ports:
  - "5174:5173"  # Au lieu de 5173:5173
```

### Nettoyer complètement

```bash
# Supprimer tout et recommencer
docker-compose down -v
docker-compose up --build
```

---

**C'est tout ! Votre application Les Mistoufles est prête ! 🐾**
