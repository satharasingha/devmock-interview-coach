/**
 * Local fallback evaluation when Gemini API is unavailable
 */
export const evaluateLocally = (userAnswer, referenceAnswer, coreKeywords) => {
  if (!userAnswer || userAnswer.trim().length === 0) {
    return {
      final_score: 0,
      keyword_score: 0,
      semantic_similarity: 0,
      matched_keywords: [],
      missing_keywords: coreKeywords || [],
      strengths: ['You started answering the question'],
      improvements: ['Please provide a complete answer to the question'],
      word_count: 0,
    };
  }

  const lowerAnswer = userAnswer.toLowerCase();
  const coreKeywordList = Array.isArray(coreKeywords) ? coreKeywords : [];
  
  // Keyword matching
  const matchedKeywords = [];
  const missingKeywords = [];

  coreKeywordList.forEach(keyword => {
    if (lowerAnswer.includes(keyword.toLowerCase())) {
      matchedKeywords.push(keyword);
    } else {
      missingKeywords.push(keyword);
    }
  });

  const keywordScore = coreKeywordList.length > 0 
    ? (matchedKeywords.length / coreKeywordList.length) * 100 
    : 60;

  // Semantic similarity (simplified)
  const semanticSimilarity = calculateSemanticSimilarity(userAnswer, referenceAnswer);
  
  // Final score calculation
  let finalScoreRaw = (keywordScore * 0.4) + (semanticSimilarity * 0.6);
  finalScoreRaw = Math.max(0, Math.min(100, finalScoreRaw));
  const finalScore = Math.round(finalScoreRaw / 10);
  
  // Generate feedback
  const { strengths, improvements } = generateFeedback(
    matchedKeywords, missingKeywords, coreKeywordList,
    semanticSimilarity, userAnswer
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
    word_count: userAnswer.split(/\s+/).filter(w => w.length > 0).length,
    filler_word_count: countFillerWords(userAnswer),
  };
};

/**
 * Calculates semantic similarity between answers
 */
const calculateSemanticSimilarity = (userAnswer, referenceAnswer) => {
  if (!userAnswer || !referenceAnswer) return 0;
  
  const userLower = userAnswer.toLowerCase();
  const refLower = referenceAnswer.toLowerCase();
  
  const userWords = new Set(userLower.split(/\s+/).filter(w => w.length > 3));
  const refWords = new Set(refLower.split(/\s+/).filter(w => w.length > 3));
  
  const intersection = new Set([...userWords].filter(x => refWords.has(x)));
  const union = new Set([...userWords, ...refWords]);
  
  const similarity = union.size > 0 
    ? (intersection.size / union.size) * 100 
    : 0;
  
  return Math.min(100, Math.max(15, similarity));
};

/**
 * Counts filler words in the answer
 */
const countFillerWords = (text) => {
  const fillerWords = ['um', 'uh', 'like', 'actually', 'basically', 'literally', 'you know'];
  let count = 0;
  fillerWords.forEach(fw => {
    const regex = new RegExp(`\\b${fw}\\b`, 'gi');
    const matches = text.match(regex);
    if (matches) count += matches.length;
  });
  return count;
};

/**
 * Generates strengths and improvements feedback
 */
const generateFeedback = (matchedKeywords, missingKeywords, coreKeywordList, semanticSimilarity, userAnswer) => {
  const strengths = [];
  const improvements = [];

  // Keyword feedback
  if (matchedKeywords.length >= coreKeywordList.length * 0.7) {
    strengths.push(`Excellent coverage of key concepts (${matchedKeywords.length}/${coreKeywordList.length} keywords)`);
  } else if (matchedKeywords.length >= coreKeywordList.length * 0.4) {
    strengths.push(`Good attempt - covered ${matchedKeywords.length} out of ${coreKeywordList.length} key concepts`);
  } else if (matchedKeywords.length > 0) {
    strengths.push(`Identified some key concepts: ${matchedKeywords.join(', ')}`);
  } else {
    improvements.push('Include technical keywords like: ' + coreKeywordList.slice(0, 3).join(', '));
  }

  // Semantic feedback
  if (semanticSimilarity > 70) {
    strengths.push('Your answer aligns well with expected response');
  } else if (semanticSimilarity > 50) {
    strengths.push('Response partially matches expected content');
  } else {
    improvements.push('Focus on directly answering the question asked');
  }

  // Length feedback
  const wordCount = userAnswer.split(/\s+/).filter(w => w.length > 0).length;
  if (wordCount < 25) {
    improvements.push('Provide more detailed answers (aim for 50-150 words)');
  } else if (wordCount > 200) {
    improvements.push('Try to be more concise - focus on quality over quantity');
  } else if (wordCount >= 50 && wordCount <= 150) {
    strengths.push('Optimal answer length - detailed but not overwhelming');
  }

  // Filler word feedback
  const fillerCount = countFillerWords(userAnswer);
  if (fillerCount > 5) {
    improvements.push(`Used ${fillerCount} filler words - practice pausing instead`);
  } else if (fillerCount > 2) {
    improvements.push(`Used ${fillerCount} filler words - try to reduce them`);
  } else if (fillerCount > 0) {
    strengths.push(`Good fluency with minimal filler words (only ${fillerCount})`);
  }

  if (missingKeywords.length > 0 && missingKeywords.length <= 3) {
    improvements.push(`Consider adding these key terms: ${missingKeywords.join(', ')}`);
  }

  if (strengths.length === 0) strengths.push('You completed the answer');
  if (improvements.length === 0) improvements.push('Great answer! Continue practicing');

  return { strengths, improvements };
};