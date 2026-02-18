from flask import Flask, request, jsonify
from evaluation.keyword_evaluator import keyword_score
from evaluation.semantic_evaluator import semantic_score

app = Flask(__name__)

@app.route("/evaluate", methods=["POST"])
def evaluate():
    data = request.json

    user_answer = data["user_answer"]
    reference_answer = data["reference_answer"]
    core_keywords = data["core_keywords"]

    keyword_result = keyword_score(user_answer, core_keywords)
    semantic_result = semantic_score(user_answer, reference_answer)

    final_score = round(
        (0.5 * keyword_result["keyword_score"] +
         0.5 * semantic_result) * 10,
        2
    )

    return jsonify({
        "final_score": final_score,
        "semantic_similarity": semantic_result,
        **keyword_result
    })

if __name__ == "__main__":
    app.run(port=5000, debug=True)
