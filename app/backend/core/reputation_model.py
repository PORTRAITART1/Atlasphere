"""Modele de score de reputation Atlasphere."""
from typing import Dict

WEIGHTS: Dict[str, int] = {
    "governance": 20,
    "community_trust": 25,
    "contribution": 20,
    "verification": 15,
    "solohost_integration": 10,
    "risk": 10,
}

LEVELS = [
    (0,      "novice"),
    (1000,   "active"),
    (5000,   "verified"),
    (10000,  "trusted"),
    (50000,  "pioneer"),
    (100000, "flagship"),
]

def level_from_score(score: int) -> str:
    xp_equivalent = score * 1000  # 1 point de score = 1000 XP
    for threshold, name in reversed(LEVELS):
        if xp_equivalent >= threshold:
            return name
    return "novice"
