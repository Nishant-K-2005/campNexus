import os
import httpx
import numpy as np

OPENROUTER_URL = "https://openrouter.ai/api/v1/embeddings"
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "baai/bge-base-en-v1.5")

_client = httpx.Client(timeout=60)

def generateEmbedding(text: str):
    response = _client.post(
        OPENROUTER_URL,
        headers={
            "Authorization": f"Bearer {os.environ['OPENROUTER_API_KEY']}",
            "Content-Type": "application/json",
        },
        json={"model": EMBEDDING_MODEL, "input": text},
    )
    response.raise_for_status()

    vec = np.asarray(response.json()["data"][0]["embedding"], dtype=np.float32)

    # same as normalize_embeddings=True
    norm = np.linalg.norm(vec)
    return vec / norm if norm > 0 else vec
