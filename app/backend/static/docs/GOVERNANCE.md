# 📜 Règles de Gouvernance Atlasphere

## Principes Fondamentaux

1. **Décentralisation** — Aucune entité unique ne contrôle les décisions
2. **Transparence** — Tous les votes et transactions sont publics
3. **Méritocratie** — Le poids de vote est basé sur la participation active
4. **Inclusivité** — Tout Pionnier KYC peut participer

## Processus de Gouvernance

### Cycle de Vie d'un Projet

```
Proposition → Vote → Approbation/Rejet → Financement → Exécution → Complétion
```

### 1. Soumission (Proposer)
- Tout Pionnier authentifié peut soumettre un projet
- Champs requis : titre, description, catégorie, budget (π), milestones
- Le projet entre en statut **"Proposed"**

### 2. Phase de Vote
- Durée : 7-30 jours (configurable par le créateur)
- **Quorum** : 5% des Pionniers actifs doivent voter
- **Seuil d'approbation** : 66% de votes "Pour"
- Vote pondéré par la réputation (formule logarithmique)

### 3. Calcul du Poids de Vote

```
Poids = log10(réputation + 10) × 10
```

| Réputation | Poids de Vote |
|-----------|--------------|
| 0 | 10.0 |
| 100 | 20.4 |
| 1000 | 30.4 |
| 10000 | 40.4 |
| 100000 | 50.4 |

→ Formule logarithmique pour éviter la domination des "whales"

### 4. Financement (Crowdfunding)
- Projets approuvés passent en phase de financement
- Contributions en Pi via smart contract escrow
- Fonds verrouillés jusqu'à validation des milestones
- Deadline de financement : 30-90 jours

### 5. Exécution & Milestones
- Le créateur soumet des preuves pour chaque milestone
- La communauté ou un validateur vérifie les preuves
- Fonds libérés progressivement par milestone

### 6. Remboursement
- Si deadline dépassée sans complétion → remboursement proportionnel
- Automatique via smart contract PiRC2

## Délégation de Votes

- Un Pionnier peut déléguer son pouvoir de vote à un autre
- Le délégué vote avec le poids combiné
- Révocable à tout moment
- Pas de sous-délégation (pas de chaîne)

## Rôles

| Rôle | Permissions |
|------|------------|
| Pionnier | Voter, contribuer, proposer |
| Créateur | Gérer son projet, soumettre milestones |
| Validateur | Vérifier les preuves de milestones |
| Admin | Modérer, gérer VIP, voir analytics |

## Catégories de Projets

- 🎓 **Éducation** — Formation, tutoriels, bourses
- 💻 **Technologie** — Apps, outils, infrastructure
- 🌍 **Environnement** — Projets écologiques, durabilité
- 🛒 **Commerce** — Marketplace, services, produits
- 🏥 **Santé** — Bien-être, médical, sport

## Anti-Abus

- KYC requis pour voter et contribuer
- Rate limiting sur les votes (1 vote/projet/utilisateur)
- Détection de sybil attacks via réputation
- Modération admin pour contenu inapproprié
- Cooldown entre créations de projets (24h)