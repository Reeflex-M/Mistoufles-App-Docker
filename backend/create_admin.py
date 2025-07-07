#!/usr/bin/env python
"""
Script pour créer automatiquement un superutilisateur par défaut.
Utilisé pour simplifier l'installation Docker.
"""

import os
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User

def create_default_admin():
    """Créer un admin par défaut si aucun superutilisateur n'existe."""
    
    if User.objects.filter(is_superuser=True).exists():
        print("✅ Un superutilisateur existe déjà.")
        return
    
    # Créer l'utilisateur admin par défaut
    admin_user = User.objects.create_superuser(
        username='admin',
        email='admin@mistoufles.fr',
        password='mistoufles2024'  # Mot de passe par défaut
    )
    
    print("✅ Superutilisateur créé avec succès !")
    print("👤 Username: admin")
    print("🔑 Password: mistoufles2024")
    print("📧 Email: admin@mistoufles.fr")
    print("")
    print("⚠️  IMPORTANT: Changez ce mot de passe en production !")

if __name__ == '__main__':
    create_default_admin() 