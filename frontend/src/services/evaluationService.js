// Evaluation Service for AI-Powered Career Support Platform

/**
 * Evaluates a user's interview answer against a reference answer and keywords
 * @param {Object} params - Evaluation parameters
 * @param {string} params.userAnswer - The user's spoken answer (converted to text)
 * @param {string} params.referenceAnswer - The ideal/reference answer for the question
 * @param {Array<string>} params.coreKeywords - Array of keywords that should be present
 * @returns {Promise<Object>} Evaluation results with scores and feedback
 */
export const evaluateAnswer = async ({ userAnswer, referenceAnswer, coreKeywords }) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Convert to lowercase for case-insensitive matching
  const lowerAnswer = userAnswer.toLowerCase();
  
  // Check for keywords
  const matchedKeywords = [];
  const missingKeywords = [];

  coreKeywords.forEach(keyword => {
    const lowerKeyword = keyword.toLowerCase();
    if (lowerAnswer.includes(lowerKeyword)) {
      matchedKeywords.push(keyword);
    } else {
      missingKeywords.push(keyword);
    }
  });

  // Calculate keyword score (percentage of keywords found)
  const keywordScore = coreKeywords.length > 0 
    ? (matchedKeywords.length / coreKeywords.length) * 100 
    : 50;

  // Calculate semantic similarity (simplified - in production use actual NLP)
  const semanticSimilarity = calculateSemanticSimilarity(userAnswer, referenceAnswer);
  
  // Calculate final score (weighted: 40% keywords, 60% semantic similarity)
  const finalScoreRaw = (keywordScore * 0.4) + (semanticSimilarity * 0.6);
  const finalScore = Math.round(finalScoreRaw / 10); // Convert to 0-10 scale
  
  // Generate strengths based on performance
  const strengths = [];
  const improvements = [];

  if (matchedKeywords.length >= coreKeywords.length * 0.7) {
    strengths.push("Good coverage of key technical concepts");
  } else if (matchedKeywords.length >= coreKeywords.length * 0.4) {
    strengths.push("Included some important keywords");
  } else {
    improvements.push("Include more technical keywords in your answer");
  }

  if (semanticSimilarity > 70) {
    strengths.push("Your answer aligns well with expected response");
  } else if (semanticSimilarity > 50) {
    strengths.push("Response partially matches expected content");
  } else {
    improvements.push("Focus on directly answering the question asked");
  }

  // Word count analysis
  const wordCount = userAnswer.split(/\s+/).filter(w => w.length > 0).length;
  if (wordCount < 30) {
    improvements.push("Provide more detailed answers with specific examples");
  } else if (wordCount > 150) {
    improvements.push("Try to be more concise and focused");
  } else {
    strengths.push("Good answer length - detailed but not overlong");
  }

  // Check for filler words
  const fillerWords = ["um", "uh", "like", "actually", "basically", "literally", "you know"];
  let fillerCount = 0;
  fillerWords.forEach(fw => {
    const regex = new RegExp(`\\b${fw}\\b`, 'gi');
    const matches = userAnswer.match(regex);
    if (matches) fillerCount += matches.length;
  });

  if (fillerCount > 5) {
    improvements.push(`Used ${fillerCount} filler words - practice pausing instead`);
  } else if (fillerCount > 2) {
    improvements.push(`Used ${fillerCount} filler words - try to reduce them`);
  } else {
    strengths.push("Good fluency with minimal filler words");
  }

  // Add generic improvements if needed
  if (improvements.length === 0 && strengths.length > 0) {
    improvements.push("Consider adding real-world examples to strengthen your answer");
  }

  return {
    final_score: finalScore,
    keyword_score: Math.round(keywordScore),
    semantic_similarity: Math.round(semanticSimilarity),
    matched_keywords: matchedKeywords,
    missing_keywords: missingKeywords,
    strengths: strengths.slice(0, 2), // Max 2 strengths
    improvements: improvements.slice(0, 2), // Max 2 improvements
    word_count: wordCount,
    filler_word_count: fillerCount,
  };
};

/**
 * Calculates semantic similarity between user answer and reference answer
 * Simplified version - in production, use sentence-transformers or OpenAI embeddings
 * @param {string} userAnswer - User's answer
 * @param {string} referenceAnswer - Reference answer
 * @returns {number} Similarity score (0-100)
 */
const calculateSemanticSimilarity = (userAnswer, referenceAnswer) => {
  // Convert to lowercase
  const userLower = userAnswer.toLowerCase();
  const refLower = referenceAnswer.toLowerCase();
  
  // Split into words
  const userWords = new Set(userLower.split(/\s+/).filter(w => w.length > 3));
  const refWords = new Set(refLower.split(/\s+/).filter(w => w.length > 3));
  
  // Calculate word overlap (Jaccard similarity)
  const intersection = new Set([...userWords].filter(x => refWords.has(x)));
  const union = new Set([...userWords, ...refWords]);
  
  const wordOverlap = union.size > 0 
    ? (intersection.size / union.size) * 100 
    : 0;
  
  // Check for key phrases (simple implementation)
  // In production, use actual NLP library like compromise or natural
  const refSentences = referenceAnswer.split(/[.!?]+/);
  let maxSimilarity = wordOverlap;
  
  refSentences.forEach(sentence => {
    const sentenceLower = sentence.toLowerCase();
    const sentenceWords = sentenceLower.split(/\s+/);
    let matchCount = 0;
    
    sentenceWords.forEach(word => {
      if (word.length > 3 && userLower.includes(word)) {
        matchCount++;
      }
    });
    
    const sentenceSimilarity = sentenceWords.length > 0 
      ? (matchCount / sentenceWords.length) * 100 
      : 0;
    
    maxSimilarity = Math.max(maxSimilarity, sentenceSimilarity);
  });
  
  // Normalize to 0-100 range with a base score
  return Math.min(100, Math.max(20, maxSimilarity));
};

/**
 * Advanced evaluation using external API (for production use)
 * @param {Object} params - Evaluation parameters
 * @returns {Promise<Object>} Evaluation results
 */
export const evaluateAnswerWithAPI = async ({ userAnswer, referenceAnswer, coreKeywords }) => {
  // Option 1: Use OpenAI API
  /*
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
          content: 'You are an interview evaluator. Score answers from 0-10.'
        },
        {
          role: 'user',
          content: `Reference answer: ${referenceAnswer}\nUser answer: ${userAnswer}\nKeywords: ${coreKeywords.join(', ')}`
        }
      ]
    })
  });
  
  const data = await response.json();
  return parseOpenAIResponse(data);
  */
  
  // Fallback to local evaluation
  return evaluateAnswer({ userAnswer, referenceAnswer, coreKeywords });
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
  const { final_score, matched_keywords, missing_keywords, strengths, improvements } = evaluationResult;
  
  let report = `=== INTERVIEW FEEDBACK REPORT ===\n\n`;
  report += `Overall Score: ${final_score}/10\n\n`;
  
  report += `KEYWORDS COVERAGE:\n`;
  report += `✓ Found: ${matched_keywords.join(', ') || 'None'}\n`;
  report += `✗ Missing: ${missing_keywords.join(', ') || 'None'}\n\n`;
  
  report += `STRENGTHS:\n`;
  strengths.forEach(s => report += `• ${s}\n`);
  
  report += `\nAREAS FOR IMPROVEMENT:\n`;
  improvements.forEach(i => report += `• ${i}\n`);
  
  report += `\nTIP: Practice using the STAR method (Situation, Task, Action, Result) for behavioral questions.\n`;
  
  return report;
};

export default {
  evaluateAnswer,
  evaluateAnswerWithAPI,
  batchEvaluateAnswers,
  generateFeedbackReport,
};