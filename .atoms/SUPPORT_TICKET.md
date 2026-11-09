# Support Ticket — Ancien problème de démarrage du backend

## Contexte
- **App** : Atlasphere (Pi Network governance platform)
- **Repo** : https://github.com/PORTRAITART1/Atlasphere
- **Domaine** : https://atlasphere-testnet.onrender.com
- **Type** : FastAPI (Python) + React (Vite)

## Problème
Le backend FastAPI ne démarrait pas sur l’ancien hébergement.
L'API renvoie systématiquement :
{"error": "No module named 'app'", "message": "Internal server error"}

text
Code HTTP : **500**

## Structure du projet
Atlasphere/
├── app/
│ ├── backend/ ← FastAPI (Python)
│ │ ├── main.py ← point d'entrée
│ │ ├── core/
│ │ ├── routers/
│ │ └── models/
│ ├── frontend/ ← React (Vite)
│ ├── start.sh ← script de démarrage (créé)
│ └── .mgx/
│ └── config.yaml ← configuration de déploiement
└── .atoms/
└── ATOMS.md

text

## Ce qu'on a essayé
1. ✅ Créé `app/start.sh` :
   ```bash
   export PYTHONPATH="$SCRIPT_DIR:$BACKEND_DIR"
   python3 -m uvicorn app.backend.main:app --host 0.0.0.0 --port 8000
✅ Modifié app/.mgx/config.yaml :

yaml
dev: bash start.sh
✅ Vérifié que start.sh fonctionne en local

Ce qu'on observe
❌ L’ancien hébergement ne semblait pas exécuter start.sh

❌ L'erreur No module named 'app' persiste

❌ Aucun journal accessible dans le dossier de diagnostic

Questions pour le support
Comment Atoms lance-t-il un backend Python (FastAPI) ?

Où se trouve la config de lancement (working directory, commande) ?

Comment définir le PYTHONPATH pour que app.backend.main soit importable ?

Faut-il un Dockerfile pour un backend Python ?

Pourquoi .mgx/config.yaml n'est-il pas pris en compte ?

Demande
Merci de nous indiquer :

La config exacte à mettre dans .mgx/config.yaml

Ou la procédure pour lancer un backend FastAPI sur Atoms

Ou un exemple de projet Python fonctionnel sur Atoms

Cordialement,
portraitart (Pi Network admin)
