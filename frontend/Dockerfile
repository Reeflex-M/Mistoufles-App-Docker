# Solution standard pour problème Rollup/Docker
FROM node:18

# Définir le répertoire de travail
WORKDIR /app

# Copier package.json en premier pour cache Docker
COPY package.json ./

# Nettoyer et installer proprement (solution standard)
RUN npm cache clean --force
RUN npm install --verbose

# Copier le reste du code source
COPY . .

# Exposer le port
EXPOSE 5173

# Démarrer l'application
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"] 