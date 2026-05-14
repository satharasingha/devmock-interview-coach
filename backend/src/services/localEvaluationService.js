/**
 * Local fallback evaluation when Groq API is unavailable
 * ✅ UPDATED: Returns format compatible with evaluationController.js
 */

/**
 * Main local evaluation function
 * ✅ FIX: Now returns format expected by evaluationController
 */
export const evaluateLocally = (userAnswer, referenceAnswer, coreKeywords) => {
  // ✅ FIX: Ensure inputs are safe
  const safeUserAnswer = userAnswer || "";
  const safeReferenceAnswer = referenceAnswer || "";
  const safeKeywords = ensureKeywordsArray(coreKeywords);
  
  // Edge case: Empty answer
  if (!safeUserAnswer || safeUserAnswer.trim().length === 0) {
    return {
      score: 0,
      feedback: "No answer provided. Please speak your answer to receive feedback.",
      matchedKeywords: [],
      missingKeywords: safeKeywords,
      improvementSuggestions: "Try to provide a complete answer. Speak clearly and cover the key concepts.",
      status: "fail",
    };
  }

  const lowerAnswer = safeUserAnswer.toLowerCase();
  
  // Keyword matching
  const matchedKeywords = [];
  const missingKeywords = [];

  safeKeywords.forEach(keyword => {
    if (lowerAnswer.includes(keyword.toLowerCase())) {
      matchedKeywords.push(keyword);
    } else {
      missingKeywords.push(keyword);
    }
  });

  const keywordScore = safeKeywords.length > 0 
    ? (matchedKeywords.length / safeKeywords.length) * 100 
    : 60;

  // Semantic similarity (simplified)
  const semanticSimilarity = calculateSemanticSimilarity(safeUserAnswer, safeReferenceAnswer);
  
  // ✅ FIX: Final score calculation (0-10 scale)
  let finalScoreRaw = (keywordScore * 0.4) + (semanticSimilarity * 0.6);
  finalScoreRaw = Math.max(0, Math.min(100, finalScoreRaw));
  let finalScore = Math.round(finalScoreRaw / 10);
  
  // ✅ FIX: Ensure score is within 0-10 range
  finalScore = Math.min(10, Math.max(0, finalScore));
  
  // ✅ FIX: Adjust score down for very short answers
  const wordCount = safeUserAnswer.split(/\s+/).filter(w => w.length > 0).length;
  if (wordCount < 10 && finalScore > 4) {
    finalScore = Math.min(finalScore, 4);
  }
  
  // Determine status based on score
  const status = finalScore >= 7 ? "pass" : "fail";
  
  // Generate feedback
  const { feedback, improvementSuggestions } = generateFeedback(
    matchedKeywords, 
    missingKeywords, 
    safeKeywords,
    semanticSimilarity, 
    safeUserAnswer,
    finalScore
  );

  // ✅ FIX: Return format matching evaluationController expectations
  return {
    score: finalScore,
    feedback: feedback,
    matchedKeywords: matchedKeywords,
    missingKeywords: missingKeywords,
    improvementSuggestions: improvementSuggestions,
    status: status,
    // ✅ Additional metadata (optional, for debugging)
    _meta: {
      keyword_score_percent: Math.round(keywordScore),
      semantic_similarity_percent: Math.round(semanticSimilarity),
      word_count: wordCount,
      filler_word_count: countFillerWords(safeUserAnswer),
      evaluation_method: "local",
    }
  };
};

/**
 * ✅ FIX: Ensure keywords are always an array and safe to use
 */
const ensureKeywordsArray = (keywords) => {
  if (!keywords) return [];
  if (Array.isArray(keywords)) return keywords;
  if (typeof keywords === 'string') return keywords.split(',').map(k => k.trim());
  return [];
};

/**
 * Calculates semantic similarity between answers
 * Compares word overlap and key phrase matching
 */
const calculateSemanticSimilarity = (userAnswer, referenceAnswer) => {
  if (!userAnswer || !referenceAnswer) return 30; // Default middle score
  
  const userLower = userAnswer.toLowerCase();
  const refLower = referenceAnswer.toLowerCase();
  
  // Word-based similarity
  const userWords = new Set(userLower.split(/\s+/).filter(w => w.length > 3));
  const refWords = new Set(refLower.split(/\s+/).filter(w => w.length > 3));
  
  const intersection = new Set([...userWords].filter(x => refWords.has(x)));
  const union = new Set([...userWords, ...refWords]);
  
  const wordSimilarity = union.size > 0 
    ? (intersection.size / union.size) * 100 
    : 0;
  
  // Sentence-based similarity
  const userSentences = userLower.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const refSentences = refLower.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  let sentenceSimilarity = 0;
  if (userSentences.length > 0 && refSentences.length > 0) {
    let totalMatches = 0;
    userSentences.forEach(userSentence => {
      const userSentenceWords = new Set(userSentence.trim().split(/\s+/));
      let bestMatch = 0;
      refSentences.forEach(refSentence => {
        const refSentenceWords = new Set(refSentence.trim().split(/\s+/));
        const sentenceIntersection = [...userSentenceWords].filter(w => refSentenceWords.has(w));
        const matchScore = userSentenceWords.size > 0 
          ? (sentenceIntersection.length / userSentenceWords.size) * 100 
          : 0;
        bestMatch = Math.max(bestMatch, matchScore);
      });
      totalMatches += bestMatch;
    });
    sentenceSimilarity = totalMatches / userSentences.length;
  }
  
  // Combined similarity (70% word, 30% sentence)
  const combinedSimilarity = (wordSimilarity * 0.7) + (sentenceSimilarity * 0.3);
  
  return Math.min(100, Math.max(15, combinedSimilarity));
};

/**
 * Counts filler words in the answer
 */
const countFillerWords = (text) => {
  if (!text) return 0;
  
  const fillerWords = [
    'um', 'uh', 'like', 'actually', 'basically', 'literally', 'you know',
    'sort of', 'kind of', 'well', 'so', 'just', 'maybe', 'perhaps',
    'i mean', 'you see', 'to be honest', 'honestly'
  ];
  let count = 0;
  const lowerText = text.toLowerCase();
  
  fillerWords.forEach(fw => {
    const regex = new RegExp(`\\b${fw}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches) count += matches.length;
  });
  
  return count;
};

/**
 * ✅ FIX: Generates feedback and improvement suggestions
 * Now returns format expected by evaluationController
 */
const generateFeedback = (matchedKeywords, missingKeywords, coreKeywordList, semanticSimilarity, userAnswer, finalScore) => {
  let feedback = "";
  const improvementsList = [];

  // ✅ Score-based feedback
  if (finalScore >= 9) {
    feedback = "Excellent answer! You demonstrated comprehensive understanding of the concept.";
  } else if (finalScore >= 7) {
    feedback = "Good answer. You covered most of the important concepts well.";
  } else if (finalScore >= 5) {
    feedback = "Satisfactory answer, but you missed some key concepts. Review the suggestions below.";
  } else if (finalScore >= 3) {
    feedback = "Your answer needs improvement. Several key concepts are missing or unclear.";
  } else {
    feedback = "Your answer does not adequately address the question. Please review the reference answer carefully.";
  }

  // Keyword feedback
  if (coreKeywordList.length > 0) {
    if (matchedKeywords.length >= coreKeywordList.length * 0.7) {
      feedback += ` You successfully covered ${matchedKeywords.length}/${coreKeywordList.length} key concepts.`;
    } else if (matchedKeywords.length >= coreKeywordList.length * 0.4) {
      feedback += ` You covered ${matchedKeywords.length} out of ${coreKeywordList.length} key concepts.`;
    } else if (matchedKeywords.length > 0) {
      feedback += ` You identified some key concepts: ${matchedKeywords.join(', ')}.`;
    } else {
      feedback += ` Your answer didn't include any of the expected key concepts.`;
    }
  }

  // Matched keywords detail
  if (matchedKeywords.length > 0 && matchedKeywords.length < coreKeywordList.length) {
    feedback += ` You mentioned: ${matchedKeywords.join(', ')}.`;
  }

  // Missing keywords feedback
  if (missingKeywords.length > 0) {
    if (missingKeywords.length <= 3) {
      feedback += ` Consider adding: ${missingKeywords.join(', ')}.`;
      improvementsList.push(`Include these key terms: ${missingKeywords.join(', ')}`);
    } else {
      feedback += ` Missing several important concepts like: ${missingKeywords.slice(0, 3).join(', ')}.`;
      improvementsList.push(`Focus on covering these concepts: ${missingKeywords.slice(0, 3).join(', ')}${missingKeywords.length > 3 ? ' and more' : ''}`);
    }
  }

  // Semantic similarity feedback
  if (semanticSimilarity > 75) {
    feedback += " Your answer structure aligns well with the expected response.";
  } else if (semanticSimilarity > 55) {
    feedback += " Your answer captures the main ideas from the ideal answer.";
  } else if (semanticSimilarity > 35) {
    improvementsList.push("Restructure your answer to better align with the question requirements");
  } else {
    improvementsList.push("Focus on directly addressing the specific question asked");
  }

  // Length feedback
  const wordCount = userAnswer.split(/\s+/).filter(w => w.length > 0).length;
  if (wordCount < 25) {
    improvementsList.push(`Provide more detailed answers (aim for 50-150 words, you wrote ${wordCount} words)`);
  } else if (wordCount > 200) {
    improvementsList.push("Try to be more concise - focus on quality over quantity");
  } else if (wordCount >= 50 && wordCount <= 150 && finalScore >= 7) {
    feedback += ` Good answer length (${wordCount} words) - detailed but focused.`;
  }

  // Filler word feedback
  const fillerCount = countFillerWords(userAnswer);
  if (fillerCount > 8) {
    improvementsList.push(`Reduce filler words (used ${fillerCount}) - practice pausing instead of saying "um" or "like"`);
  } else if (fillerCount > 3) {
    improvementsList.push(`Try to reduce filler words (used ${fillerCount}) for more professional delivery`);
  } else if (fillerCount > 0 && finalScore >= 7) {
    feedback += ` Good fluency with minimal filler words (only ${fillerCount}).`;
  }

  // Specific feedback for common missing concepts
  if (missingKeywords.some(k => k.toLowerCase().includes('example'))) {
    improvementsList.push("Add concrete examples to strengthen your answer");
  }
  if (missingKeywords.some(k => k.toLowerCase().includes('result') || k.toLowerCase().includes('metric'))) {
    improvementsList.push("Quantify your results with specific metrics when possible");
  }
  if (missingKeywords.some(k => k.toLowerCase().includes('structure') || k.toLowerCase().includes('approach'))) {
    improvementsList.push("Structure your answer using a clear framework (e.g., STAR method)");
  }

  // Ensure we always have at least one improvement suggestion
  let improvementSuggestions = "";
  if (improvementsList.length > 0) {
    improvementSuggestions = improvementsList.slice(0, 3).join(". ") + ".";
  } else if (finalScore >= 7) {
    improvementSuggestions = "Great job! To improve further, try adding real-world examples or diving deeper into specific technical details.";
  } else {
    improvementSuggestions = "Review the reference answer and try to include more specific technical details in your response.";
  }

  return { feedback, improvementSuggestions };
};

// Export all functions for use in other modules
export default {
  evaluateLocally,
  calculateSemanticSimilarity,
  countFillerWords,
  generateFeedback,
  ensureKeywordsArray,
};