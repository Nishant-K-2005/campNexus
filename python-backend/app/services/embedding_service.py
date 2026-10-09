import os
import numpy as np
from huggingface_hub import InferenceClient

_client = None

def _get_client() -> InferenceClient:
    global _client
    if _client is None:
        _client = InferenceClient(
            provider="hf-inference",
            api_key=os.environ["HF_TOKEN"],
            timeout=60,
        )
    return _client

def generateEmbedding(text: str):
    result = _get_client().feature_extraction(
        text,
        model="BAAI/bge-small-en-v1.5",
    )
    vec = np.asarray(result, dtype=np.float32).reshape(-1)  # flatten to 1D (384,)

    # same as normalize_embeddings=True
    norm = np.linalg.norm(vec)
    return vec / norm if norm > 0 else vec
