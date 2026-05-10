import { CONSTANTS } from '../utils/constants.js';

/**
 * Builds the evaluation prompt for Gemini API
 */
const buildEvaluationPrompt = (userAnswer, referenceAnswer, coreKeywords) => {
  return `You are an expert technical interviewer for software engineering roles.

EVALUATION TASK:
Evaluate the candidate's answer to this interview question.

INPUT DATA:
- Question Keywords: ${coreKeywords.join(', ')}
- Reference Answer: ${referenceAnswer}
- Candidate's Answer: ${userAnswer}

OUTPUT REQUIREMENTS:
Return ONLY a valid JSON object. No other text, no markdown, no explanations.

JSON STRUCTURE:
{
  "score": <integer 0-10>,
  "strengths": ["<specific strength 1>", "<specific strength 2>"],
  "improvements": ["<specific area to improve 1>", "<specific area to improve 2>"],
  "matched_keywords": ["<keyword found>"],
  "missing_keywords": ["<keyword missing>"]
}

SCORING GUIDELINES:
- 8-10: Excellent - Comprehensive, accurate, well-structured
- 6-7: Good - Mostly correct, minor gaps
- 4-5: Satisfactory - Basic understanding, missing key points
- 0-3: Needs Improvement - Significant gaps or incorrect

Be strict but fair. Score based on technical accuracy, completeness, and communication.`;
};

/**
 * Validates Gemini API response
 */
const validateGeminiResponse = (responseData) => {
  try {
    const resultText = responseData.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!resultText) {
      throw new Error('Empty response from Gemini API');
    }
    
    const parsed = JSON.parse(resultText);
    
    // Validate required fields
    if (typeof parsed.score !== 'number' || parsed.score < 0 || parsed.score > 10) {
      throw new Error('Invalid score in response');
    }
    
    return {
      final_score: parsed.score,
      semantic_similarity: parsed.score * 10,
      matched_keywords: Array.isArray(parsed.matched_keywords) ? parsed.matched_keywords : [],
      missing_keywords: Array.isArray(parsed.missing_keywords) ? parsed.missing_keywords : [],
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths.slice(0, 2) : [],
      improvements: Array.isArray(parsed.improvements) ? parsed.improvements.slice(0, 2) : [],
    };
  } catch (error) {
    throw new Error(`Invalid JSON response: ${error.message}`);
  }
};

/**
 * Calls Gemini API to evaluate an answer
 */
export const evaluateWithGemini = async (userAnswer, referenceAnswer, coreKeywords, apiKey) => {
  // Validate API key
  if (!apiKey || apiKey === CONSTANTS.INVALID_API_KEY_PLACEHOLDER) {
    throw new Error('Invalid or missing API key');
  }

  const prompt = buildEvaluationPrompt(userAnswer, referenceAnswer, coreKeywords);
  
  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CONSTANTS.GEMINI_TIMEOUT);

  try {
    const response = await fetch(`${CONSTANTS.GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json'
        }
      })
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const validatedResult = validateGeminiResponse(data);
    
    console.log(`✅ Gemini evaluation success - Score: ${validatedResult.final_score}/10`);
    return validatedResult;
    
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error('Gemini API request timed out');
    }
    throw error;
  }
};