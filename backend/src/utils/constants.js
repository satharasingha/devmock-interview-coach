export const CONSTANTS = {
  // Gemini API
  GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
  GEMINI_TIMEOUT: parseInt(process.env.GEMINI_TIMEOUT) || 15000,
  
  // Default placeholder (used only for validation, never sent to API)
  INVALID_API_KEY_PLACEHOLDER: 'INVALID_API_KEY_PLACEHOLDER',
  
  // Evaluation weights
  EVALUATION_WEIGHTS: {
    KEYWORD: 0.4,
    SEMANTIC: 0.6
  },
  
  // Score thresholds
  SCORE_THRESHOLDS: {
    EXCELLENT: 8,
    GOOD: 6,
    SATISFACTORY: 5
  }
};