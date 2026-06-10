from sklearn.metrics.pairwise import cosine_similarity

def calculateSimilarity(contentEmbedding: list, categoryEmbedding: list):
    score = cosine_similarity(
        [contentEmbedding],
        [categoryEmbedding]
    )
    return float(score[0][0])