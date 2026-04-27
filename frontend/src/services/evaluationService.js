/**
 * Evaluates a user's interview answer against a reference answer and keywords
 * @param {Object} params - Evaluation parameters
 * @param {string} params.userAnswer - The user's spoken answer (converted to text)
 * @param {string} params.referenceAnswer - The ideal/reference answer for the question
 * @param {Array<string>} params.coreKeywords - Array of keywords that should be present (from MongoDB)
 * @param {Array<string>} params.supportingKeywords - Optional array of supporting keywords (from MongoDB)
 * @returns {Promise<Object>} Evaluation results with scores and feedback
 */
export const evaluateAnswer = async ({ userAnswer, referenceAnswer, coreKeywords, supportingKeywords = [] }) => {
  // Simulate API delay (remove in production)
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Input validation
  if (!userAnswer || userAnswer.trim().length === 0) {
    return {
      final_score: 0,
      keyword_score: 0,
      semantic_similarity: 0,
      matched_keywords: [],
      missing_keywords: coreKeywords || [],
      matched_supporting: [],
      missing_supporting: supportingKeywords,
      strengths: ["You started answering the question"],
      improvements: ["Please provide a complete answer to the question"],
      word_count: 0,
      filler_word_count: 0,
    };
  }

  // Convert to lowercase for case-insensitive matching
  const lowerAnswer = userAnswer.toLowerCase();
  
  // Handle core keywords (already array from MongoDB)
  const coreKeywordList = Array.isArray(coreKeywords) ? coreKeywords : [];
  const supportingKeywordList = Array.isArray(supportingKeywords) ? supportingKeywords : [];
  
  // Check for core keywords
  const matchedKeywords = [];
  const missingKeywords = [];

  coreKeywordList.forEach(keyword => {
    const lowerKeyword = keyword.toLowerCase();
    if (lowerAnswer.includes(lowerKeyword)) {
      matchedKeywords.push(keyword);
    } else {
      missingKeywords.push(keyword);
    }
  });

  // Check for supporting keywords (bonus)
  const matchedSupporting = [];
  const missingSupporting = [];

  supportingKeywordList.forEach(keyword => {
    const lowerKeyword = keyword.toLowerCase();
    if (lowerAnswer.includes(lowerKeyword)) {
      matchedSupporting.push(keyword);
    } else {
      missingSupporting.push(keyword);
    }
  });

  // Calculate keyword score (percentage of core keywords found)
  const keywordScore = coreKeywordList.length > 0 
    ? (matchedKeywords.length / coreKeywordList.length) * 100 
    : 60; // Default if no keywords specified

  // Calculate supporting keyword bonus (max 10% extra)
  const supportingBonus = supportingKeywordList.length > 0
    ? (matchedSupporting.length / supportingKeywordList.length) * 10
    : 0;

  // Calculate semantic similarity using improved algorithm
  const semanticSimilarity = calculateSemanticSimilarity(userAnswer, referenceAnswer);
  
  // Calculate final score (weighted: 35% keywords, 10% supporting bonus, 55% semantic similarity)
  let finalScoreRaw = (keywordScore * 0.35) + supportingBonus + (semanticSimilarity * 0.55);
  // Ensure score is between 0-100
  finalScoreRaw = Math.max(0, Math.min(100, finalScoreRaw));
  const finalScore = Math.round(finalScoreRaw / 10); // Convert to 0-10 scale
  
  // Generate detailed strengths and improvements
  const strengths = [];
  const improvements = [];

  // Keyword analysis
  if (matchedKeywords.length >= coreKeywordList.length * 0.8) {
    strengths.push(`Excellent coverage of key concepts (${matchedKeywords.length}/${coreKeywordList.length} keywords found)`);
  } else if (matchedKeywords.length >= coreKeywordList.length * 0.5) {
    strengths.push(`Good attempt - covered ${matchedKeywords.length} out of ${coreKeywordList.length} key concepts`);
  } else if (matchedKeywords.length > 0) {
    strengths.push(`Identified some key concepts: ${matchedKeywords.join(', ')}`);
  } else {
    improvements.push("Include technical keywords like: " + coreKeywordList.slice(0, 3).join(', '));
  }

  // Supporting keywords bonus feedback
  if (matchedSupporting.length > 0) {
    strengths.push(`Great use of supporting terminology: ${matchedSupporting.slice(0, 3).join(', ')}`);
  }

  // Semantic similarity analysis
  if (semanticSimilarity > 75) {
    strengths.push("Your answer closely matches the expected response structure");
  } else if (semanticSimilarity > 55) {
    strengths.push("Response captures main ideas from the ideal answer");
  } else if (semanticSimilarity > 35) {
    improvements.push("Focus on directly addressing the specific question asked");
  } else {
    improvements.push("Restructure your answer to better align with the question's requirements");
  }

  // Word count analysis
  const wordCount = userAnswer.split(/\s+/).filter(w => w.length > 0).length;
  if (wordCount < 25) {
    improvements.push("Provide more detailed answers (aim for 50-150 words)");
  } else if (wordCount > 200) {
    improvements.push("Try to be more concise - focus on quality over quantity");
  } else if (wordCount >= 50 && wordCount <= 150) {
    strengths.push("Optimal answer length - detailed but not overwhelming");
  }

  // Check for filler words
  const fillerWordList = ["um", "uh", "like", "actually", "basically", "literally", "you know", "sort of", "kind of", "well", "so"];
  let fillerCount = 0;
  fillerWordList.forEach(fw => {
    const regex = new RegExp(`\\b${fw}\\b`, 'gi');
    const matches = userAnswer.match(regex);
    if (matches) fillerCount += matches.length;
  });

  if (fillerCount > 8) {
    improvements.push(`Used ${fillerCount} filler words - practice pausing instead of using "um" or "like"`);
  } else if (fillerCount > 3) {
    improvements.push(`Used ${fillerCount} filler words - try to reduce them for more professional delivery`);
  } else if (fillerCount > 0) {
    strengths.push(`Good fluency with minimal filler words (only ${fillerCount})`);
  } else {
    strengths.push("Excellent fluency - no filler words detected");
  }

  // Missing keywords feedback
  if (missingKeywords.length > 0 && missingKeywords.length <= 3) {
    improvements.push(`Consider adding these key terms: ${missingKeywords.join(', ')}`);
  } else if (missingKeywords.length > 3) {
    improvements.push(`Missing several important concepts: ${missingKeywords.slice(0, 3).join(', ')} and more`);
  }

  // Specific feedback for missing core concepts
  if (missingKeywords.includes("example") || missingKeywords.includes("examples")) {
    improvements.push("Add concrete examples to strengthen your answer");
  }
  if (missingKeywords.includes("result") || missingKeywords.includes("results")) {
    improvements.push("Quantify your results with specific metrics when possible");
  }

  // Ensure we always have at least one strength and improvement
  if (strengths.length === 0) {
    strengths.push("You completed the answer - review the suggestions to improve");
  }
  if (improvements.length === 0) {
    improvements.push("Great answer! Continue practicing to maintain this level");
  }

  // Calculate confidence score based on answer quality
  const confidenceScore = Math.min(100, Math.round(
    (finalScoreRaw * 0.5) + 
    (semanticSimilarity * 0.3) + 
    (keywordScore * 0.2)
  ));

  return {
    final_score: finalScore,
    final_score_percentage: Math.round(finalScoreRaw),
    keyword_score: Math.round(keywordScore),
    supporting_bonus: Math.round(supportingBonus),
    semantic_similarity: Math.round(semanticSimilarity),
    confidence_score: confidenceScore,
    matched_keywords: matchedKeywords,
    missing_keywords: missingKeywords,
    matched_supporting: matchedSupporting,
    missing_supporting: missingSupporting,
    strengths: strengths.slice(0, 3), // Max 3 strengths
    improvements: improvements.slice(0, 3), // Max 3 improvements
    word_count: wordCount,
    filler_word_count: fillerCount,
    answer_length_status: wordCount < 50 ? "too_short" : (wordCount > 150 ? "too_long" : "optimal"),
  };
};

/**
 * Calculates semantic similarity between user answer and reference answer
 * Enhanced version with better NLP techniques
 * @param {string} userAnswer - User's answer
 * @param {string} referenceAnswer - Reference answer
 * @returns {number} Similarity score (0-100)
 */
const calculateSemanticSimilarity = (userAnswer, referenceAnswer) => {
  if (!userAnswer || !referenceAnswer) return 0;
  
  // Convert to lowercase and clean
  const userLower = userAnswer.toLowerCase().replace(/[^\w\s]/g, '');
  const refLower = referenceAnswer.toLowerCase().replace(/[^\w\s]/g, '');
  
  // Split into words (filter out short words)
  const userWords = userLower.split(/\s+/).filter(w => w.length > 2);
  const refWords = refLower.split(/\s+/).filter(w => w.length > 2);
  
  if (userWords.length === 0 || refWords.length === 0) return 0;
  
  // Calculate word overlap (Jaccard similarity)
  const userWordSet = new Set(userWords);
  const refWordSet = new Set(refWords);
  
  const intersection = new Set([...userWordSet].filter(x => refWordSet.has(x)));
  const union = new Set([...userWordSet, ...refWordSet]);
  
  const jaccardSimilarity = union.size > 0 
    ? (intersection.size / union.size) * 100 
    : 0;
  
  // Calculate n-gram similarity (2-grams)
  const getUserBigrams = (text) => {
    const words = text.split(/\s+/);
    const bigrams = [];
    for (let i = 0; i < words.length - 1; i++) {
      bigrams.push(`${words[i]} ${words[i+1]}`);
    }
    return bigrams;
  };
  
  const userBigrams = getUserBigrams(userLower);
  const refBigrams = getUserBigrams(refLower);
  
  const bigramIntersection = userBigrams.filter(b => refBigrams.includes(b));
  const bigramSimilarity = userBigrams.length > 0
    ? (bigramIntersection.length / userBigrams.length) * 100
    : 0;
  
  // Calculate sentence structure similarity
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
        const matchScore = (sentenceIntersection.length / userSentenceWords.size) * 100;
        bestMatch = Math.max(bestMatch, matchScore);
      });
      totalMatches += bestMatch;
    });
    sentenceSimilarity = totalMatches / userSentences.length;
  }
  
  // Combined similarity score (weighted)
  const combinedScore = (jaccardSimilarity * 0.4) + (bigramSimilarity * 0.4) + (sentenceSimilarity * 0.2);
  
  // Normalize to 0-100 with a minimum score for partial matches
  return Math.min(100, Math.max(15, combinedScore));
};

/**
 * Advanced evaluation using OpenAI API (for production use)
 * @param {Object} params - Evaluation parameters
 * @returns {Promise<Object>} Evaluation results
 */
export const evaluateAnswerWithOpenAI = async ({ userAnswer, referenceAnswer, coreKeywords, supportingKeywords = [] }) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an interview evaluator for technical positions. Evaluate answers based on accuracy, completeness, and communication. Return JSON only.'
          },
          {
            role: 'user',
            content: `Evaluate this interview answer:
            
Question expected keywords: ${coreKeywords.join(', ')}
Reference answer: ${referenceAnswer}
User's answer: ${userAnswer}

Return JSON with: final_score (0-10), strengths (array), improvements (array), matched_keywords (array)`
          }
        ],
        temperature: 0.3,
        response_format: { type: "json_object" }
      })
    });
    
    const data = await response.json();
    const parsedResult = JSON.parse(data.choices[0].message.content);
    
    return {
      final_score: parsedResult.final_score || 5,
      keyword_score: 70,
      semantic_similarity: 70,
      confidence_score: 80,
      matched_keywords: parsedResult.matched_keywords || [],
      missing_keywords: coreKeywords.filter(k => !parsedResult.matched_keywords?.includes(k)),
      matched_supporting: [],
      missing_supporting: supportingKeywords,
      strengths: parsedResult.strengths || ["Answer provided"],
      improvements: parsedResult.improvements || ["Review the reference answer for better structure"],
      word_count: userAnswer.split(/\s+/).length,
      filler_word_count: 0,
    };
  } catch (error) {
    console.error("OpenAI evaluation failed, falling back to local evaluation:", error);
    return evaluateAnswer({ userAnswer, referenceAnswer, coreKeywords, supportingKeywords });
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
    const result = await evaluateAnswer(answer);
    results.push(result);
  }
  return results;
};

/**
 * Generate a detailed feedback report
 * @param {Object} evaluationResult - Result from evaluateAnswer
 * @returns {string} Formatted feedback report
 */
export const generateFeedbackReport = (evaluationResult) => {
  const { 
    final_score, 
    final_score_percentage,
    matched_keywords, 
    missing_keywords, 
    matched_supporting,
    strengths, 
    improvements,
    word_count,
    filler_word_count,
    answer_length_status
  } = evaluationResult;
  
  let report = `╔══════════════════════════════════════════════════════════════╗\n`;
  report += `║              INTERVIEW FEEDBACK REPORT                        ║\n`;
  report += `╚══════════════════════════════════════════════════════════════╝\n\n`;
  
  report += `📊 OVERALL SCORE: ${final_score}/10 (${final_score_percentage}%)\n`;
  report += `${'='.repeat(60)}\n\n`;
  
  report += `📝 KEYWORD ANALYSIS:\n`;
  report += `   ✓ Core keywords found: ${matched_keywords.join(', ') || 'None'}\n`;
  report += `   ✗ Core keywords missing: ${missing_keywords.join(', ') || 'None'}\n`;
  if (matched_supporting && matched_supporting.length > 0) {
    report += `   ✓ Supporting terms used: ${matched_supporting.join(', ')}\n`;
  }
  report += `\n`;
  
  report += `💪 STRENGTHS:\n`;
  strengths.forEach((s, i) => report += `   ${i+1}. ${s}\n`);
  report += `\n`;
  
  report += `🎯 AREAS FOR IMPROVEMENT:\n`;
  improvements.forEach((i, idx) => report += `   ${idx+1}. ${i}\n`);
  report += `\n`;
  
  report += `📈 STATISTICS:\n`;
  report += `   • Words spoken: ${word_count}\n`;
  report += `   • Filler words: ${filler_word_count}\n`;
  report += `   • Answer length: ${answer_length_status === 'optimal' ? '✅ Optimal' : (answer_length_status === 'too_short' ? '⚠️ Too short' : '⚠️ Too long')}\n`;
  report += `\n`;
  
  report += `💡 TIP: Practice using the STAR method (Situation, Task, Action, Result)\n`;
  report += `   for behavioral questions to structure your answers effectively.\n`;
  report += `\n`;
  report += `${'='.repeat(60)}\n`;
  report += `© DevMock - AI-Powered Interview Coach\n`;
  
  return report;
};

/**
 * Calculate overall performance metrics across multiple evaluations
 * @param {Array} evaluationResults - Array of evaluation results
 * @returns {Object} Aggregated metrics
 */
export const calculateAggregateMetrics = (evaluationResults) => {
  if (!evaluationResults || evaluationResults.length === 0) {
    return {
      average_score: 0,
      total_questions: 0,
      total_words: 0,
      total_filler_words: 0,
      strength_areas: [],
      improvement_areas: []
    };
  }
  
  const totalScore = evaluationResults.reduce((sum, r) => sum + r.final_score, 0);
  const totalWords = evaluationResults.reduce((sum, r) => sum + (r.word_count || 0), 0);
  const totalFillers = evaluationResults.reduce((sum, r) => sum + (r.filler_word_count || 0), 0);
  
  // Collect common strengths and improvements
  const allStrengths = evaluationResults.flatMap(r => r.strengths || []);
  const allImprovements = evaluationResults.flatMap(r => r.improvements || []);
  
  const strengthCounts = {};
  const improvementCounts = {};
  
  allStrengths.forEach(s => { strengthCounts[s] = (strengthCounts[s] || 0) + 1; });
  allImprovements.forEach(i => { improvementCounts[i] = (improvementCounts[i] || 0) + 1; });
  
  const topStrengths = Object.entries(strengthCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([s]) => s);
    
  const topImprovements = Object.entries(improvementCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([i]) => i);
  
  return {
    average_score: (totalScore / evaluationResults.length).toFixed(1),
    total_questions: evaluationResults.length,
    total_words: totalWords,
    total_filler_words: totalFillers,
    filler_word_ratio: totalWords > 0 ? ((totalFillers / totalWords) * 100).toFixed(1) : 0,
    strength_areas: topStrengths,
    improvement_areas: topImprovements
  };
};

export default {
  evaluateAnswer,
  evaluateAnswerWithOpenAI,
  batchEvaluateAnswers,
  generateFeedbackReport,
  calculateAggregateMetrics,
};