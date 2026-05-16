from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

model = SentenceTransformer("BAAI/bge-small-en-v1.5")

def calculateSimilarity(content: str, category: str):
    contentEmbedding = getEmbedding(content)
    categoryEmbedding = getEmbedding(category)
    
    score = cosine_similarity(
        [contentEmbedding],
        [categoryEmbedding]
    )
    return  {
        "score": float(score[0][0]),
        "categoryEmbedding" :categoryEmbedding,
        "contentEmbedding": contentEmbedding,
    }



def getEmbedding(text: str):
    return model.encode(
        text,normalize_embeddings=True
    )