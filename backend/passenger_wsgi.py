import os
import sys

from backend.wsgi import application

# Ajout du chemin du projet au PYTHONPATH
sys.path.insert(0, os.path.dirname(__file__))
