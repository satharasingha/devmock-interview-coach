import { evaluateWithGemini } from '../services/geminiService.js';
import { evaluateLocally } from '../services/localEvaluationService.js';
import { CONSTANTS } from '../utils/constants.js';

/**
 * Main evaluation controller - tries Gemini first, falls back to local
 */
export const evaluateAnswer = async (req, res, next) => {
  const startTime = Date.now();
  
  try {
    const { userAnswer, referenceAnswer, coreKeywords } = req.body;
    
    // Input validation
    if (!userAnswer || !referenceAnswer) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userAnswer and referenceAnswer are required'
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    let result;
    let evaluationMethod = 'local';
    
    // Try Gemini API first if key is valid
    if (apiKey && apiKey !== CONSTANTS.INVALID_API_KEY_PLACEHOLDER) {
      try {
        console.log('🤖 Attempting Gemini API evaluation...');
        result = await evaluateWithGemini(userAnswer, referenceAnswer, coreKeywords, apiKey);
        evaluationMethod = 'gemini';
        console.log(`✅ Gemini evaluation successful (${Date.now() - startTime}ms)`);
      } catch (geminiError) {
        console.warn(`⚠️ Gemini API failed: ${geminiError.message}. Falling back to local evaluation.`);
        result = evaluateLocally(userAnswer, referenceAnswer, coreKeywords);
        evaluationMethod = 'local_fallback';
      }
    } else {
      console.log('📝 Using local evaluation (no valid API key)');
      result = evaluateLocally(userAnswer, referenceAnswer, coreKeywords);
      evaluationMethod = 'local';
    }
    
    // Add metadata to response
    const response = {
      success: true,
      data: result,
      meta: {
        evaluation_method: evaluationMethod,
        processing_time_ms: Date.now() - startTime,
        timestamp: new Date().toISOString()
      }
    };
    
    res.json(response);
    
  } catch (error) {
    console.error('❌ Evaluation error:', error);
    next(error);
  }
};