def keyword_score(user_answer, core_keywords):
    user_answer = user_answer.lower()

    matched = []
    missing = []

    for kw in core_keywords:
        if kw.lower() in user_answer:
            matched.append(kw)
        else:
            missing.append(kw)

    score = len(matched) / len(core_keywords) if core_keywords else 0

    return {
        "keyword_score": round(score, 2),
        "matched_keywords": matched,
        "missing_keywords": missing
    }
