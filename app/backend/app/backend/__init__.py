"""Expose the flattened backend directory as the ``app.backend`` package."""

from pathlib import Path

__path__ = [str(Path(__file__).resolve().parents[2])]
