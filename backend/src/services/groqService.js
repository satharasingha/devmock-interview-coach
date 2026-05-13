import Groq from 'groq-sdk';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Debug: Check if API key is loaded
console.log('GROQ_API_KEY loaded:', process.env.GROQ_API_KEY ? 'Yes' : 'No');
console.log('API Key length:', process.env.GROQ_API_KEY?.length || 0);

// Initialize Groq client with explicit API key
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Cache for Groq responses to avoid duplicate API calls
const responseCache = new Map();
const CACHE_TTL = 3600000; // 1 hour

/**
 * Check if the answer is invalid (I don't know, pass, skip, etc.)
 */
const isInvalidAnswer = (userAnswer) => {
  const invalidPhrases = [
    "i don't know", "i dont know", "i don\'t know", "i do not know",
    "not sure", "no idea", "i have no idea", "i don't understand",
    "i cant answer", "i cannot answer", "pass", "skip", "next question",
    "i'm not sure", "i am not sure", "dont know", "dk"
  ];
  const lowerAnswer = userAnswer.toLowerCase();
  return invalidPhrases.some(phrase => lowerAnswer.includes(phrase));
};

/**
 * Check if answer is too short (less than 5 words)
 */
const isAnswerTooShort = (userAnswer) => {
  const wordCount = userAnswer.trim().split(/\s+/).length;
  return wordCount < 5;
};

/**
 * Evaluate answer using Groq API
 */
export const evaluateWithGroq = async (userAnswer, referenceAnswer, coreKeywords) => {
  // Check if API key is available
  if (!process.env.GROQ_API_KEY) {
    console.warn("GROQ_API_KEY not found in environment variables");
    return null;
  }

  // PRE-CHECK: Invalid answer detection (I don't know)
  if (isInvalidAnswer(userAnswer)) {
    console.log("Invalid answer detected (I don't know / not sure), returning low score");
    return {
      final_score: 1,
      semantic_similarity: 10,
      matched_keywords: [],
      missing_keywords: coreKeywords || [],
      strengths: ["You acknowledged you don't know the answer"],
      improvements: ["Review the reference answer to learn this concept", "Study the key technical terms"],
      evaluation_method: "precheck_invalid",
    };
  }

  // PRE-CHECK: Answer too short
  if (isAnswerTooShort(userAnswer)) {
    console.log("⚠️ Answer too short, returning low score");
    return {
      final_score: 2,
      semantic_similarity: 20,
      matched_keywords: [],
      missing_keywords: coreKeywords || [],
      strengths: ["You provided an answer"],
      improvements: ["Provide more detailed answers with specific technical concepts", `Include keywords like: ${coreKeywords.slice(0, 3).join(', ')}`],
      evaluation_method: "precheck_too_short",
    };
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

SCORING RULES (VERY IMPORTANT):
- Score 0-2: Answer shows NO understanding, says "I don't know", or is completely wrong
- Score 3-4: Answer has major gaps, missing most key concepts, or partially incorrect
- Score 5-6: Basic understanding present but missing several key concepts
- Score 7-8: Good understanding, most key concepts covered, minor gaps
- Score 9-10: Excellent, comprehensive, all key concepts covered, well-structured

BE STRICT AND HONEST. If the answer is vague or missing key technical terms, give a LOW score.

Provide your evaluation as a VALID JSON object ONLY (no other text, no markdown):

{
  "score": <integer 0-10>,
  "strengths": ["<specific strength 1>", "<specific strength 2>"],
  "improvements": ["<specific area to improve 1>", "<specific area to improve 2>"],
  "matched_keywords": ["<keyword found>"],
  "missing_keywords": ["<keyword missing>"]
}

Remember:
- If the candidate didn't mention key technical terms, they should be in missing_keywords
- Score must reflect the quality of the answer accurately
- Be strict - a vague answer should get a low score (3-4)`;

    console.log("Calling Groq API for evaluation...");

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You are an expert technical interviewer. Be strict and honest in your evaluation. Return only valid JSON. Score 0-2 for answers that show no understanding or say 'I don't know'. Score 3-4 for vague or incomplete answers."
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

    // Ensure score is within 0-10 range
    let score = result.score || 5;
    score = Math.min(10, Math.max(0, score));
    
    // If score is too high for a poor answer, adjust
    if (score >= 5 && isAnswerTooShort(userAnswer)) {
      score = Math.min(score, 4);
      console.log("Adjusted score down due to short answer");
    }

    const evaluatedResult = {
      final_score: score,
      semantic_similarity: score * 10,
      matched_keywords: result.matched_keywords || [],
      missing_keywords: result.missing_keywords || coreKeywords || [],
      strengths: result.strengths || ["Answer provided"],
      improvements: result.improvements || ["Review the reference answer for better structure", "Include key technical terms"],
      evaluation_method: "groq",
    };

    // Cache the result
    responseCache.set(cacheKey, {
      data: evaluatedResult,
      timestamp: Date.now(),
    });

    console.log(`Groq evaluation complete - Score: ${evaluatedResult.final_score}/10`);
    return evaluatedResult;

  } catch (error) {
    console.error("Groq API error:", error.message);
    return null;
  }
};

export default { evaluateWithGroq };