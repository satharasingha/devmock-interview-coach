from sklearn.metrics.pairwise import cosine_similarity
from models.miniLM_model import model

def semantic_score(user_answer, reference_answer):
    embeddings = model.encode([user_answer, reference_answer])
    similarity = cosine_similarity(
        [embeddings[0]],
        [embeddings[1]]
    )[0][0]

    return round(float(similarity), 2)
