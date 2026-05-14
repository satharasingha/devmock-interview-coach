// API Service - All backend communication
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Evaluates a user's answer using the backend API
 * @param {string} userAnswer - The user's spoken answer (converted to text)
 * @param {string} referenceAnswer - The ideal/reference answer for the question
 * @param {Array<string>} coreKeywords - Array of keywords that should be present
 * @returns {Promise<Object>} Evaluation results with scores and feedback
 */
export const evaluateAnswerAPI = async (userAnswer, referenceAnswer, coreKeywords) => {
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
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Evaluation failed');
    }
    
    console.log(`Evaluation complete (${result.meta?.evaluation_method || 'unknown'}) - Score: ${result.data?.final_score}/10`);
    return result.data;
    
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
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
  } catch {
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
    const result = await evaluateAnswerAPI(
      answer.userAnswer,
      answer.referenceAnswer,
      answer.coreKeywords
    );
    results.push(result);
  }
  return results;
};

// Default export for convenience
export default {
  evaluateAnswerAPI,
  healthCheck,
  batchEvaluateAnswers,
};