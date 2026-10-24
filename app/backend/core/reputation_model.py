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
    (0,    "novice"),
    (100,  "active"),
    (500,  "verified"),
    (1000, "trusted"),
    (5000, "pioneer"),
    (10000,"flagship"),
]

def level_from_score(score: int) -> str:
    for threshold, name in reversed(LEVELS):
        if score >= threshold:
            return name
    return "novice"
