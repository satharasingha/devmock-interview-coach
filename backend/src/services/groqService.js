import Groq from 'groq-sdk';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Debug: Check if API key is loaded
console.log('GROQ_API_KEY loaded:', process.env.GROQ_API_KEY ? '✅ Yes' : '❌ No');
console.log('API Key length:', process.env.GROQ_API_KEY?.length || 0);

// Initialize Groq client with explicit API key
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Cache for Groq responses to avoid duplicate API calls
const responseCache = new Map();
const CACHE_TTL = 3600000; // 1 hour

/**
 * Evaluate answer using Groq API
 */
export const evaluateWithGroq = async (userAnswer, referenceAnswer, coreKeywords) => {
  // Check if API key is available
  if (!process.env.GROQ_API_KEY) {
    console.warn("GROQ_API_KEY not found in environment variables");
    return null;
  }

  try {
    // Check cache first
    const cacheKey = `${userAnswer.substring(0, 200)}_${referenceAnswer.substring(0, 200)}`;
    if (responseCache.has(cacheKey)) {
      const cached = responseCache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_TTL) {
        console.log("Using cached Groq response");
        return cached.data;
      }
      responseCache.delete(cacheKey);
    }

    const prompt = `You are an expert technical interviewer. Evaluate the candidate's answer.

QUESTION KEYWORDS: ${coreKeywords.join(', ')}
REFERENCE ANSWER: ${referenceAnswer}
CANDIDATE'S ANSWER: ${userAnswer}

Provide your evaluation as a VALID JSON object ONLY (no other text, no markdown):

{
  "score": <integer 0-10>,
  "strengths": ["<specific strength 1>", "<specific strength 2>"],
  "improvements": ["<specific area to improve 1>", "<specific area to improve 2>"],
  "matched_keywords": ["<keyword found>"],
  "missing_keywords": ["<keyword missing>"]
}

Scoring guidelines:
- 8-10: Excellent - Comprehensive, accurate, well-structured
- 6-7: Good - Mostly correct, minor gaps
- 4-5: Satisfactory - Basic understanding, missing key points
- 0-3: Needs Improvement - Significant gaps or incorrect

Be strict but fair. Score based on technical accuracy, completeness, and communication.`;

    console.log("Calling Groq API for evaluation...");

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You are an expert technical interviewer. Return only valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 500,
    });

    const resultText = completion.choices[0]?.message?.content;
    console.log("Groq response received:", resultText?.substring(0, 100) + "...");
    
    // Parse the JSON response
    let result;
    try {
      // Try to extract JSON if there's extra text
      const jsonMatch = resultText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        result = JSON.parse(resultText);
      }
    } catch (parseError) {
      console.error("Failed to parse Groq response:", resultText);
      throw new Error("Invalid JSON response from Groq");
    }

    const evaluatedResult = {
      final_score: result.score || 5,
      semantic_similarity: (result.score || 5) * 10,
      matched_keywords: result.matched_keywords || [],
      missing_keywords: result.missing_keywords || [],
      strengths: result.strengths || ["Answer provided"],
      improvements: result.improvements || ["Review the reference answer for better structure"],
      evaluation_method: "groq",
    };

    // Cache the result
    responseCache.set(cacheKey, {
      data: evaluatedResult,
      timestamp: Date.now(),
    });

    console.log(`✅ Groq evaluation complete - Score: ${evaluatedResult.final_score}/10`);
    return evaluatedResult;

  } catch (error) {
    console.error("Groq API error:", error.message);
    return null;
  }
};

export default { evaluateWithGroq };