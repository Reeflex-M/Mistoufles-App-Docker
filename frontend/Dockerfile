
FROM node:18

WORKDIR /app

# Copier package.json en premier pour cache Docker
COPY package.json ./

# Clean + installer propre
RUN npm cache clean --force
RUN npm install --verbose


COPY . .

# port front
EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"] 