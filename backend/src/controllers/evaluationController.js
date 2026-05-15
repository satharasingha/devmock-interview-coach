import { evaluateWithGroq } from '../services/groqService.js';
import { evaluateLocally } from '../services/localEvaluationService.js';

/**
 * Main evaluation controller - tries Groq first, falls back to local
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

    let result;
    let evaluationMethod = 'local';
    let groqError = null;

    // Try Groq API first
    try {
      console.log('Attempting Groq API evaluation...');
      const groqResult = await evaluateWithGroq(userAnswer, referenceAnswer, coreKeywords);
      
      if (groqResult) {
        result = groqResult;
        evaluationMethod = 'groq';
        console.log(`Groq evaluation successful (${Date.now() - startTime}ms)`);
      } else {
        throw new Error('Groq returned null result');
      }
    } catch (groqError) {
      groqError = error;
      console.warn(`Groq API failed: ${error.message}. Falling back to local evaluation.`);
      result = evaluateLocally(userAnswer, referenceAnswer, coreKeywords);
      evaluationMethod = 'local_fallback';
    }
    
    // Add metadata to response
    const response = {
      success: true,
      data: result,
      meta: {
        evaluation_method: evaluationMethod,
        processing_time_ms: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        groq_error: groqError?.message || null,
      }
    };
    
    res.json(response);
    
  } catch (error) {
    console.error('Evaluation error:', error);
    next(error);
  }
};