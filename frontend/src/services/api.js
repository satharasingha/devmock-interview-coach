// API Service - All backend communication
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Local fallback evaluation (runs in browser when API fails)
 * @param {string} userAnswer - The user's spoken answer (converted to text)
 * @param {string} referenceAnswer - The ideal/reference answer for the question
 * @param {Array<string>} coreKeywords - Array of keywords that should be present
 * @returns {Object} Evaluation results with scores and feedback
 */
const evaluateLocally = (userAnswer, referenceAnswer, coreKeywords) => {
  console.log('📍 Using local evaluation fallback...');
  
  // Check for empty answer
  if (!userAnswer || userAnswer.trim().length === 0) {
    return {
      final_score: 0,
      semantic_similarity: 0,
      matched_keywords: [],
      missing_keywords: coreKeywords || [],
      strengths: ['You started answering the question'],
      improvements: ['Please provide a complete answer to the question'],
      corrected_answer: referenceAnswer,
      evaluation_method: 'local_fallback_empty'
    };
  }

  const lowerAnswer = userAnswer.toLowerCase();
  const coreKeywordList = Array.isArray(coreKeywords) ? coreKeywords : [];
  
  // Check for "I don't know" answers
  const iDontKnowPhrases = [
    "i don't know", "i dont know", "i don\'t know", "i do not know",
    "not sure", "no idea", "i have no idea", "i don't understand",
    "i cant answer", "i cannot answer", "pass", "skip", "next question",
    "i'm not sure", "i am not sure", "dont know", "dk", "no clue",
    "i'm not familiar", "i am not familiar", "not familiar"
  ];
  
  const isIDontKnow = iDontKnowPhrases.some(phrase => lowerAnswer.includes(phrase));
  
  if (isIDontKnow) {
    return {
      final_score: 1,
      semantic_similarity: 10,
      matched_keywords: [],
      missing_keywords: coreKeywordList,
      strengths: ['You acknowledged you don\'t know the answer'],
      improvements: [
        'Instead of saying "I don\'t know", share what you DO know',
        'Try saying: "I\'m not fully sure, but based on my understanding..."'
      ],
      corrected_answer: referenceAnswer,
      evaluation_method: 'local_fallback_idk'
    };
  }
  
  // Check for too short answer (less than 5 words)
  const wordCount = userAnswer.trim().split(/\s+/).filter(w => w.length > 0).length;
  if (wordCount < 5) {
    return {
      final_score: 2,
      semantic_similarity: 20,
      matched_keywords: [],
      missing_keywords: coreKeywordList,
      strengths: ['You provided an answer'],
      improvements: [
        'Provide more detailed answers (aim for 50-150 words)',
        `Include keywords like: ${coreKeywordList.slice(0, 3).join(', ')}`
      ],
      corrected_answer: referenceAnswer,
      evaluation_method: 'local_fallback_short'
    };
  }
  
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
  
  // Calculate keyword score (percentage)
  const keywordScorePercentage = coreKeywordList.length > 0 
    ? (matchedKeywords.length / coreKeywordList.length) * 100 
    : 50;
  
  // Calculate semantic similarity (simplified - word overlap)
  const userWords = new Set(lowerAnswer.split(/\s+/).filter(w => w.length > 3));
  const refWords = new Set(referenceAnswer?.toLowerCase().split(/\s+/).filter(w => w.length > 3) || []);
  const intersection = new Set([...userWords].filter(x => refWords.has(x)));
  const union = new Set([...userWords, ...refWords]);
  const semanticScore = union.size > 0 ? (intersection.size / union.size) * 100 : 0;
  
  // Final score calculation (70% keyword, 30% semantic)
  let finalScoreRaw = (keywordScorePercentage * 0.7) + (semanticScore * 0.3);
  finalScoreRaw = Math.max(0, Math.min(100, finalScoreRaw));
  let finalScore = Math.round(finalScoreRaw / 10);
  finalScore = Math.min(10, Math.max(0, finalScore));
  
  // Adjust score based on word count
  if (wordCount < 25 && finalScore > 5) {
    finalScore = Math.max(3, finalScore - 1);
  }
  if (wordCount > 100 && finalScore < 8) {
    finalScore = Math.min(8, finalScore + 1);
  }
  
  // Generate strengths and improvements
  const strengths = [];
  const improvements = [];
  
  if (matchedKeywords.length >= coreKeywordList.length * 0.7) {
    strengths.push(`Excellent coverage - ${matchedKeywords.length}/${coreKeywordList.length} keywords found`);
  } else if (matchedKeywords.length >= coreKeywordList.length * 0.4) {
    strengths.push(`Good - covered ${matchedKeywords.length}/${coreKeywordList.length} key concepts`);
  } else if (matchedKeywords.length > 0) {
    strengths.push(`Identified: ${matchedKeywords.slice(0, 3).join(', ')}`);
  } else {
    improvements.push(`Include keywords like: ${coreKeywordList.slice(0, 3).join(', ')}`);
  }
  
  if (wordCount >= 50 && wordCount <= 150) {
    strengths.push(`Good answer length (${wordCount} words)`);
  } else if (wordCount < 25) {
    improvements.push(`Provide more detail (${wordCount} words, aim for 50+)`);
  }
  
  if (missingKeywords.length > 0) {
    improvements.push(`Consider adding: ${missingKeywords.slice(0, 3).join(', ')}`);
  }
  
  // Ensure we always have at least one strength and improvement
  if (strengths.length === 0) {
    strengths.push('You provided an answer to the question');
  }
  if (improvements.length === 0 && finalScore < 8) {
    improvements.push('Review the perfect answer above to improve');
  }
  
  return {
    final_score: finalScore,
    semantic_similarity: Math.round(semanticScore),
    matched_keywords: matchedKeywords,
    missing_keywords: missingKeywords,
    strengths: strengths.slice(0, 3),
    improvements: improvements.slice(0, 3),
    corrected_answer: referenceAnswer,
    evaluation_method: 'local_fallback',
    word_count: wordCount
  };
};

/**
 * Evaluates a user's answer using the backend API (with local fallback)
 * @param {string} userAnswer - The user's spoken answer (converted to text)
 * @param {string} referenceAnswer - The ideal/reference answer for the question
 * @param {Array<string>} coreKeywords - Array of keywords that should be present
 * @returns {Promise<Object>} Evaluation results with scores and feedback
 */
export const evaluateAnswerAPI = async (userAnswer, referenceAnswer, coreKeywords) => {
  // First, try to call the backend API
  try {
    console.log("Calling backend API for evaluation...");
    
    const response = await fetch(`${API_BASE_URL}/evaluate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userAnswer,
        referenceAnswer,
        coreKeywords: Array.isArray(coreKeywords) ? coreKeywords : [],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.warn(`API returned ${response.status}: ${errorData.error || 'Unknown error'}`);
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      console.warn('API returned unsuccessful response:', result.error);
      throw new Error(result.error || 'Evaluation failed');
    }
    
    console.log(`API evaluation complete (${result.meta?.evaluation_method || 'unknown'}) - Score: ${result.data?.final_score}/10`);
    return result.data;
    
  } catch (apiError) {
    console.warn('⚠️ Backend API failed, using local evaluation fallback...');
    console.error('API Error details:', apiError.message);
    
    // FALLBACK: Use local evaluation when API fails
    const localResult = evaluateLocally(userAnswer, referenceAnswer, coreKeywords);
    console.log(`📍 Local fallback complete - Score: ${localResult.final_score}/10`);
    
    return localResult;
  }
};

/**
 * Health check endpoint to verify backend is running
 * @returns {Promise<boolean>} True if backend is healthy
 */
export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
    return response.ok;
  } catch (error) {
    console.warn('Health check failed:', error.message);
    return false;
  }
};

/**
 * Batch evaluate multiple answers
 * @param {Array} answers - Array of answer objects
 * @returns {Promise<Array>} Array of evaluation results
 */
export const batchEvaluateAnswers = async (answers) => {
  const results = [];
  for (const answer of answers) {
    try {
      const result = await evaluateAnswerAPI(
        answer.userAnswer,
        answer.referenceAnswer,
        answer.coreKeywords
      );
      results.push(result);
    } catch (error) {
      console.error('Batch evaluation failed for one answer:', error);
      // Use local fallback for individual answer
      const localResult = evaluateLocally(
        answer.userAnswer,
        answer.referenceAnswer,
        answer.coreKeywords
      );
      results.push(localResult);
    }
  }
  return results;
};


export const quickLocalEvaluate = (userAnswer, referenceAnswer, coreKeywords) => {
  return evaluateLocally(userAnswer, referenceAnswer, coreKeywords);
};

// Default export for convenience
export default {
  evaluateAnswerAPI,
  healthCheck,
  batchEvaluateAnswers,
  quickLocalEvaluate,
};