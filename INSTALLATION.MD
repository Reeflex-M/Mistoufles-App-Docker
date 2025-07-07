# 1. Cloner

git clone [votre-repo]
cd Mistoufles-App

# 2. UNE SEULE COMMANDE !

docker-compose up --build (dans la racine)

Acceder a : http://localhost:5173/

🔑 Identifiants automatiques :
Username : admin
Password : mistoufles2024
Email : admin@mistoufles.fr

Alternative si user par crée auto :
docker exec -it mistoufles_backend python create_admin.py
OU
docker exec -it mistoufles_backend python manage.py createsuperuser
