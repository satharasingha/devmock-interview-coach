/**
 * Local fallback evaluation when Groq API is unavailable
 */
export const evaluateLocally = (userAnswer, referenceAnswer, coreKeywords) => {
  if (!userAnswer || userAnswer.trim().length === 0) {
    return {
      final_score: 0,
      keyword_score: 0,
      semantic_similarity: 0,
      matched_keywords: [],
      missing_keywords: coreKeywords || [],
      strengths: ["You started answering the question"],
      improvements: ["Please provide a complete answer to the question"],
      perfect_answer:
        referenceAnswer ||
        "Provide a detailed answer explaining the key concepts.",
      word_count: 0,
      filler_word_count: 0,
      evaluation_method: "local",
    };
  }

  const lowerAnswer = userAnswer.toLowerCase();
  const coreKeywordList = Array.isArray(coreKeywords) ? coreKeywords : [];

  // Check for "I don't know" answers
  const iDontKnowPhrases = [
    "i don't know",
    "i dont know",
    "i don\'t know",
    "i do not know",
    "not sure",
    "no idea",
    "i have no idea",
    "i don't understand",
    "i cant answer",
    "i cannot answer",
    "pass",
    "skip",
    "next question",
    "i'm not sure",
    "i am not sure",
    "dont know",
    "dk",
    "no clue",

    "i'm not familiar",
    "i am not familiar",
    "not familiar",
    "i haven't learned",
    "i haven't studied",
    "i'm not confident",
    "i am not confident",
    "i don't recall",
    "i don't remember",
    "i'm not comfortable",
    "i am not comfortable",
  ];

  const isIDontKnow = iDontKnowPhrases.some((phrase) =>
    lowerAnswer.includes(phrase),
  );

  if (isIDontKnow) {
    return {
      final_score: 1,
      keyword_score: 0,
      semantic_similarity: 5,
      matched_keywords: [],
      missing_keywords: coreKeywordList,
      strengths: ["You were honest about not knowing the answer"],
      improvements: [
        "Don't say 'I don't know' - instead, share what you DO know and build from there",
        "Try saying: 'I'm not fully sure, but based on my understanding...'",
        `Study these key concepts: ${coreKeywordList.slice(0, 3).join(", ")}`,
      ],
      perfect_answer:
        referenceAnswer ||
        "Provide a complete answer explaining the key concepts.",
      word_count: userAnswer.split(/\s+/).filter((w) => w.length > 0).length,
      filler_word_count: countFillerWords(userAnswer),
      evaluation_method: "local_idk",
    };
  }

  // Keyword matching
  const matchedKeywords = [];
  const missingKeywords = [];

  coreKeywordList.forEach((keyword) => {
    if (lowerAnswer.includes(keyword.toLowerCase())) {
      matchedKeywords.push(keyword);
    } else {
      missingKeywords.push(keyword);
    }
  });

  const keywordScore =
    coreKeywordList.length > 0
      ? (matchedKeywords.length / coreKeywordList.length) * 100
      : 60;

  // Semantic similarity (simplified)
  const semanticSimilarity = calculateSemanticSimilarity(
    userAnswer,
    referenceAnswer,
  );

  // Final score calculation
  let finalScoreRaw = keywordScore * 0.4 + semanticSimilarity * 0.6;
  finalScoreRaw = Math.max(0, Math.min(100, finalScoreRaw));
  const finalScore = Math.round(finalScoreRaw / 10);

  // Generate feedback
  const { strengths, improvements } = generateFeedback(
    matchedKeywords,
    missingKeywords,
    coreKeywordList,
    semanticSimilarity,
    userAnswer,
  );

  return {
    final_score: finalScore,
    final_score_percentage: Math.round(finalScoreRaw),
    keyword_score: Math.round(keywordScore),
    semantic_similarity: Math.round(semanticSimilarity),
    matched_keywords: matchedKeywords,
    missing_keywords: missingKeywords,
    strengths: strengths.slice(0, 3),
    improvements: improvements.slice(0, 3),
    perfect_answer:
      referenceAnswer ||
      "Review the ideal answer above to learn the key concepts.",
    word_count: userAnswer.split(/\s+/).filter((w) => w.length > 0).length,
    filler_word_count: countFillerWords(userAnswer),
    evaluation_method: "local",
  };
};

/**
 * Calculates semantic similarity between answers
 * Compares word overlap and key phrase matching
 */
const calculateSemanticSimilarity = (userAnswer, referenceAnswer) => {
  if (!userAnswer || !referenceAnswer) return 0;

  const userLower = userAnswer.toLowerCase();
  const refLower = referenceAnswer.toLowerCase();

  // Word-based similarity
  const userWords = new Set(userLower.split(/\s+/).filter((w) => w.length > 3));
  const refWords = new Set(refLower.split(/\s+/).filter((w) => w.length > 3));

  const intersection = new Set([...userWords].filter((x) => refWords.has(x)));
  const union = new Set([...userWords, ...refWords]);

  const wordSimilarity =
    union.size > 0 ? (intersection.size / union.size) * 100 : 0;

  // Sentence-based similarity
  const userSentences = userLower
    .split(/[.!?]+/)
    .filter((s) => s.trim().length > 0);
  const refSentences = refLower
    .split(/[.!?]+/)
    .filter((s) => s.trim().length > 0);

  let sentenceSimilarity = 0;
  if (userSentences.length > 0 && refSentences.length > 0) {
    let totalMatches = 0;
    userSentences.forEach((userSentence) => {
      const userSentenceWords = new Set(userSentence.trim().split(/\s+/));
      let bestMatch = 0;
      refSentences.forEach((refSentence) => {
        const refSentenceWords = new Set(refSentence.trim().split(/\s+/));
        const sentenceIntersection = [...userSentenceWords].filter((w) =>
          refSentenceWords.has(w),
        );
        const matchScore =
          userSentenceWords.size > 0
            ? (sentenceIntersection.length / userSentenceWords.size) * 100
            : 0;
        bestMatch = Math.max(bestMatch, matchScore);
      });
      totalMatches += bestMatch;
    });
    sentenceSimilarity = totalMatches / userSentences.length;
  }

  // Combined similarity (70% word, 30% sentence)
  const combinedSimilarity = wordSimilarity * 0.7 + sentenceSimilarity * 0.3;

  return Math.min(100, Math.max(15, combinedSimilarity));
};

/**
 * Counts filler words in the answer
 */
const countFillerWords = (text) => {
  const fillerWords = [
    "um",
    "uh",
    "like",
    "actually",
    "basically",
    "literally",
    "you know",
    "sort of",
    "kind of",
    "well",
    "so",
    "just",
    "maybe",
    "perhaps",
    "i mean",
    "you see",
    "to be honest",
    "honestly",
  ];
  let count = 0;
  const lowerText = text.toLowerCase();

  fillerWords.forEach((fw) => {
    const regex = new RegExp(`\\b${fw}\\b`, "gi");
    const matches = lowerText.match(regex);
    if (matches) count += matches.length;
  });

  return count;
};

/**
 * Generates strengths and improvements feedback
 */
const generateFeedback = (
  matchedKeywords,
  missingKeywords,
  coreKeywordList,
  semanticSimilarity,
  userAnswer,
) => {
  const strengths = [];
  const improvements = [];

  // Keyword feedback
  if (coreKeywordList.length > 0) {
    if (matchedKeywords.length >= coreKeywordList.length * 0.7) {
      strengths.push(
        `Excellent coverage of key concepts (${matchedKeywords.length}/${coreKeywordList.length} keywords found)`,
      );
    } else if (matchedKeywords.length >= coreKeywordList.length * 0.4) {
      strengths.push(
        `Good attempt - covered ${matchedKeywords.length} out of ${coreKeywordList.length} key concepts`,
      );
    } else if (matchedKeywords.length > 0) {
      strengths.push(
        `Identified some key concepts: ${matchedKeywords.join(", ")}`,
      );
    } else {
      improvements.push(
        `Include technical keywords like: ${coreKeywordList.slice(0, 3).join(", ")}`,
      );
    }
  }

  // Semantic feedback
  if (semanticSimilarity > 75) {
    strengths.push("Your answer aligns very well with the expected response");
  } else if (semanticSimilarity > 55) {
    strengths.push("Response captures the main ideas from the ideal answer");
  } else if (semanticSimilarity > 35) {
    improvements.push(
      "Focus on directly addressing the specific question asked",
    );
  } else {
    improvements.push(
      "Restructure your answer to better align with the question requirements",
    );
  }

  // Length feedback
  const wordCount = userAnswer.split(/\s+/).filter((w) => w.length > 0).length;
  if (wordCount < 25) {
    improvements.push("Provide more detailed answers (aim for 50-150 words)");
  } else if (wordCount > 200) {
    improvements.push(
      "Try to be more concise - focus on quality over quantity",
    );
  } else if (wordCount >= 50 && wordCount <= 150) {
    strengths.push(
      `Optimal answer length - ${wordCount} words is detailed but focused`,
    );
  } else if (wordCount > 0) {
    strengths.push(`Good answer length (${wordCount} words)`);
  }

  // Filler word feedback
  const fillerCount = countFillerWords(userAnswer);
  if (fillerCount > 8) {
    improvements.push(
      `Used ${fillerCount} filler words - practice pausing instead of using "um" or "like"`,
    );
  } else if (fillerCount > 3) {
    improvements.push(
      `Used ${fillerCount} filler words - try to reduce them for more professional delivery`,
    );
  } else if (fillerCount > 0) {
    strengths.push(
      `Good fluency with minimal filler words (only ${fillerCount})`,
    );
  } else if (wordCount > 10) {
    strengths.push("Excellent fluency - no filler words detected");
  }

  // Missing keywords feedback
  if (missingKeywords.length > 0 && missingKeywords.length <= 3) {
    improvements.push(
      `Consider adding these key terms: ${missingKeywords.join(", ")}`,
    );
  } else if (missingKeywords.length > 3) {
    improvements.push(
      `Missing several important concepts: ${missingKeywords.slice(0, 3).join(", ")} and more`,
    );
  }

  // Specific feedback for common missing concepts
  if (missingKeywords.some((k) => k.toLowerCase().includes("example"))) {
    improvements.push("Add concrete examples to strengthen your answer");
  }
  if (
    missingKeywords.some(
      (k) =>
        k.toLowerCase().includes("result") ||
        k.toLowerCase().includes("metric"),
    )
  ) {
    improvements.push(
      "Quantify your results with specific metrics when possible",
    );
  }
  if (
    missingKeywords.some(
      (k) =>
        k.toLowerCase().includes("structure") ||
        k.toLowerCase().includes("approach"),
    )
  ) {
    improvements.push(
      "Structure your answer using a clear framework (e.g., STAR method)",
    );
  }

  // Ensure we always have at least one strength and one improvement
  if (strengths.length === 0 && wordCount > 0) {
    strengths.push(
      "You provided an answer - let's work on making it more complete",
    );
  } else if (strengths.length === 0) {
    strengths.push("You started answering the question");
  }

  if (improvements.length === 0 && strengths.length > 0) {
    improvements.push(
      "Great answer! Continue practicing to maintain this level",
    );
  } else if (improvements.length === 0) {
    improvements.push(
      "Review the ideal answer to understand what key points were missed",
    );
  }

  return { strengths, improvements };
};

// Export all functions for use in other modules
export default {
  evaluateLocally,
  calculateSemanticSimilarity,
  countFillerWords,
  generateFeedback,
};
