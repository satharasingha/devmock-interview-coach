import Groq from "groq-sdk";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Debug: Check if API key is loaded
console.log("GROQ_API_KEY loaded:", process.env.GROQ_API_KEY ? "Yes" : "No");
console.log("API Key length:", process.env.GROQ_API_KEY?.length || 0);

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
  if (!userAnswer) return true;

  const invalidPhrases = [
    "i don't know",
    "i dont know",
    "i don\'t know",
    "i do not know",
    "not sure",
    "no idea",
    "i have no idea",
    "i don't understand",
    "i cant answer",
    "i cannot answer",
    "pass",
    "skip",
    "next question",
    "i'm not sure",
    "i am not sure",
    "dont know",
    "dk",
  ];
  const lowerAnswer = userAnswer.toLowerCase();
  return invalidPhrases.some((phrase) => lowerAnswer.includes(phrase));
};

/**
 * Check if answer is too short (less than 5 words)
 */
const isAnswerTooShort = (userAnswer) => {
  if (!userAnswer) return true;
  const wordCount = userAnswer.trim().split(/\s+/).length;
  return wordCount < 5;
};

/**
 * Ensure keywords are always an array and safe to use
 */
const ensureKeywordsArray = (keywords) => {
  if (!keywords) return [];
  if (Array.isArray(keywords)) return keywords;
  if (typeof keywords === "string")
    return keywords.split(",").map((k) => k.trim());
  return [];
};

/**
 * Evaluate answer using Groq API
 * Updated to match the expected return format from evaluationController
 */
export const evaluateWithGroq = async (
  userAnswer,
  referenceAnswer,
  coreKeywords,
) => {
  //Ensure coreKeywords is a safe array
  const safeKeywords = ensureKeywordsArray(coreKeywords);
  const safeUserAnswer = userAnswer || "";
  const safeReferenceAnswer = referenceAnswer || "";

  // Check if API key is available
  if (!process.env.GROQ_API_KEY) {
    console.warn("GROQ_API_KEY not found in environment variables");
    return null;
  }

  // PRE-CHECK: Invalid answer detection (I don't know)
  if (isInvalidAnswer(safeUserAnswer)) {
    console.log(
      "Invalid answer detected (I don't know / not sure), returning low score",
    );
    return {
      score: 1,
      feedback:
        "You indicated you don't know this concept. Please review the material and try again.",
      matchedKeywords: [],
      missingKeywords: safeKeywords,
      improvementSuggestions: `Study these concepts: ${safeKeywords.join(", ")}. Review the reference answer for better understanding.`,
      status: "fail",
    };
  }

  // PRE-CHECK: Answer too short
  if (isAnswerTooShort(safeUserAnswer)) {
    console.log("⚠️ Answer too short, returning low score");
    const topKeywords = safeKeywords.slice(0, 3);
    return {
      score: 2,
      feedback: "Your answer is too short and lacks sufficient detail.",
      matchedKeywords: [],
      missingKeywords: safeKeywords,
      improvementSuggestions: `Provide more detailed answers. Include key concepts like: ${topKeywords.join(", ")}.`,
      status: "fail",
    };
  }

  try {
    // Check cache first
    const cacheKey = `${safeUserAnswer.substring(0, 200)}_${safeReferenceAnswer.substring(0, 200)}`;
    if (responseCache.has(cacheKey)) {
      const cached = responseCache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_TTL) {
        console.log("Using cached Groq response");
        return cached.data;
      }
      responseCache.delete(cacheKey);
    }

    //  Safely create keywords string
    const keywordsString =
      safeKeywords.length > 0
        ? safeKeywords.join(", ")
        : "No specific keywords provided";

    const prompt = `You are an expert technical interviewer. Evaluate the candidate's answer.

KEY CONCEPTS TO LOOK FOR: ${keywordsString}
REFERENCE ANSWER: ${safeReferenceAnswer}
CANDIDATE'S ANSWER: ${safeUserAnswer}

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
  "feedback": "<detailed constructive feedback string>",
  "matchedKeywords": ["<keyword found 1>", "<keyword found 2>"],
  "missingKeywords": ["<keyword missing 1>", "<keyword missing 2>"],
  "improvementSuggestions": "<specific suggestions to improve>",
  "status": "pass" or "fail"
}

Remember:
- Status "pass" if score >= 7, "fail" if score < 7
- If the candidate didn't mention key technical terms, they should be in missingKeywords
- Score must reflect the quality of the answer accurately
- Be strict - a vague answer should get a low score (3-4)`;

    console.log("Calling Groq API for evaluation...");

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are an expert technical interviewer. Be strict and honest in your evaluation. Return only valid JSON. Score 0-2 for answers that show no understanding or say 'I don't know'. Score 3-4 for vague or incomplete answers. Score 7+ for good answers that cover most key concepts.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.2,
      max_tokens: 800, // FIX: Increased for better feedback
    });

    const resultText = completion.choices[0]?.message?.content;

    if (!resultText) {
      console.error("Empty response from Groq API");
      throw new Error("Empty response from Groq");
    }

    console.log(
      "Groq response received:",
      resultText.substring(0, 100) + "...",
    );

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

    // FIX: Ensure score is within 0-10 range
    let score = result.score || 5;
    score = Math.min(10, Math.max(0, score));

    // FIX: Ensure matchedKeywords and missingKeywords are arrays
    const matchedKeywords = Array.isArray(result.matchedKeywords)
      ? result.matchedKeywords
      : result.matched_keywords
        ? Array.isArray(result.matched_keywords)
          ? result.matched_keywords
          : []
        : [];

    const missingKeywords = Array.isArray(result.missingKeywords)
      ? result.missingKeywords
      : result.missing_keywords
        ? Array.isArray(result.missing_keywords)
          ? result.missing_keywords
          : safeKeywords
        : safeKeywords;

    // If score is too high for a poor answer, adjust
    if (score >= 5 && isAnswerTooShort(safeUserAnswer)) {
      score = Math.min(score, 4);
      console.log("Adjusted score down due to short answer");
    }

    // Determine status based on score
    const status = score >= 7 ? "pass" : "fail";

    // FIX: Build feedback if not provided
    let feedback = result.feedback || "";
    if (!feedback) {
      if (score >= 9) {
        feedback =
          "Excellent answer! You covered all key concepts thoroughly and demonstrated strong understanding.";
      } else if (score >= 7) {
        feedback =
          "Good answer. You covered most of the important concepts well.";
      } else if (score >= 5) {
        feedback =
          "Satisfactory answer, but you missed some key concepts. Review the suggestions below.";
      } else if (score >= 3) {
        feedback =
          "Your answer needs improvement. Several key concepts are missing or unclear.";
      } else {
        feedback =
          "Your answer does not adequately address the question. Please review the reference answer carefully.";
      }
    }

    // FIX: Build improvement suggestions if not provided
    let improvementSuggestions = result.improvementSuggestions || "";
    if (!improvementSuggestions && missingKeywords.length > 0) {
      improvementSuggestions = `Focus on explaining these concepts: ${missingKeywords.join(", ")}. Review the reference answer for better understanding.`;
    } else if (!improvementSuggestions) {
      improvementSuggestions =
        "Review the reference answer and try to include more specific technical details in your response.";
    }

    // FIX: Return in the format expected by evaluationController
    const evaluatedResult = {
      score: score,
      feedback: feedback,
      matchedKeywords: matchedKeywords,
      missingKeywords: missingKeywords,
      improvementSuggestions: improvementSuggestions,
      status: status,
    };

    // Cache the result
    responseCache.set(cacheKey, {
      data: evaluatedResult,
      timestamp: Date.now(),
    });

    console.log(
      `Groq evaluation complete - Score: ${evaluatedResult.score}/10 - Status: ${evaluatedResult.status}`,
    );
    return evaluatedResult;
  } catch (error) {
    console.error("Groq API error:", error.message);
    return null; // Return null to trigger fallback to local evaluation
  }
};

export default { evaluateWithGroq };
