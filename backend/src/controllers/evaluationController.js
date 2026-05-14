import { evaluateWithGroq } from "../services/groqService.js";
import { evaluateLocally } from "../services/localEvaluationService.js";

/**
 * Main evaluation controller - tries Groq first, falls back to local
 */
export const evaluateAnswer = async (req, res, next) => {
  const startTime = Date.now();

  try {
    // ✅ FIX: Accept multiple field name variations
    const userAnswer = req.body.userAnswer || req.body.answer;
    const referenceAnswer = req.body.referenceAnswer || req.body.modelAnswer;
    let coreKeywords = req.body.coreKeywords || req.body.keywords || [];

    // ✅ FIX: Ensure coreKeywords is always an array
    if (!Array.isArray(coreKeywords)) {
      coreKeywords = [];
    }

    // Input validation
    if (!userAnswer || !referenceAnswer) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: userAnswer and referenceAnswer are required",
      });
    }

    let result;
    let evaluationMethod = "local";
    let groqError = null;

    // Try Groq API first
    try {
      console.log("Attempting Groq API evaluation...");
      const groqResult = await evaluateWithGroq(
        userAnswer,
        referenceAnswer,
        coreKeywords,
      );

      if (groqResult) {
        result = groqResult;
        evaluationMethod = "groq";
        console.log(`Groq evaluation successful (${Date.now() - startTime}ms)`);
      } else {
        throw new Error("Groq returned null result");
      }
    } catch (err) {  // ✅ FIX: Changed 'error' to 'err'
      groqError = err;  // ✅ FIX: Changed 'error' to 'err'
      console.warn(
        `⚠️ Groq API failed: ${err.message}. Falling back to local evaluation.`,  // ✅ FIX: Changed 'error' to 'err'
      );
      result = evaluateLocally(userAnswer, referenceAnswer, coreKeywords);
      evaluationMethod = "local_fallback";
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
      },
    };

    res.json(response);
  } catch (err) {  // ✅ FIX: Changed 'error' to 'err'
    console.error("❌ Evaluation error:", err);  // ✅ FIX: Changed 'error' to 'err'
    console.error("Error details:", err.message);
    
    res.status(500).json({
      success: false,
      error: err.message,  // ✅ FIX: Changed 'error' to 'err'
      timestamp: new Date().toISOString()
    });
  }
};