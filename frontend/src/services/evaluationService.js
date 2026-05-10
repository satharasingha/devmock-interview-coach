// Evaluation Service for AI-Powered Career Support Platform
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Import config directly
import config from "../../config.js";
// Use API key from config
const GEMINI_API_KEY = config.GEMINI_API_KEY;

console.log("Gemini API Key configured:", GEMINI_API_KEY ? "Yes ✅" : "No ❌");
console.log("API Key length:", GEMINI_API_KEY ? GEMINI_API_KEY.length : 0);

/**
 * Evaluates a user's interview answer using Google Gemini API
 * Falls back to local evaluation if API fails or key is missing
 */
export const evaluateWithGemini = async ({ userAnswer, referenceAnswer, coreKeywords }) => {
  // Check if API key is available
  if (!GEMINI_API_KEY || GEMINI_API_KEY === "AIzaSyDacvRSEYyvRFPK7yWYaBPlWIS0XWQr8dQ") {
    console.warn("Gemini API key is missing or using default. Using local evaluation.");
    return evaluateAnswer({ userAnswer, referenceAnswer, coreKeywords });
  }

  console.log("📡 Calling Gemini API for evaluation...");

  // Build the prompt for Gemini
  const prompt = `You are an expert technical interviewer for software engineering roles. 
  
Evaluate the candidate's answer to this interview question.

QUESTION KEYWORDS: ${coreKeywords.join(', ')}
REFERENCE ANSWER: ${referenceAnswer}
CANDIDATE'S ANSWER: ${userAnswer}

Provide your evaluation as a VALID JSON object ONLY (no other text, no markdown formatting):

{
  "score": <integer 0-10>,
  "strengths": ["<specific strength 1>", "<specific strength 2>"],
  "improvements": ["<specific area to improve 1>", "<specific area to improve 2>"],
  "matched_keywords": ["<keyword found>"],
  "missing_keywords": ["<keyword missing>"]
}

Be strict but fair. Score based on technical accuracy, completeness, and communication.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json"
          }
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API Error:", errorData);
      throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const resultText = data.candidates[0].content.parts[0].text;
    
    // Parse the JSON response from Gemini
    let result;
    try {
      result = JSON.parse(resultText);
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", resultText);
      throw new Error("Invalid JSON response from API");
    }

    console.log("✅ Gemini evaluation complete! Score:", result.score);

    return {
      final_score: result.score || 5,
      semantic_similarity: (result.score || 5) * 10,
      matched_keywords: result.matched_keywords || [],
      missing_keywords: result.missing_keywords || [],
      strengths: result.strengths || ["Answer provided"],
      improvements: result.improvements || ["Review the reference answer for better structure"],
    };
  } catch (error) {
    console.error("Gemini evaluation failed:", error);
    console.log("Falling back to local evaluation...");
    return evaluateAnswer({ userAnswer, referenceAnswer, coreKeywords });
  }
};

// Keep your existing evaluateAnswer as fallback
export const evaluateAnswer = async ({ userAnswer, referenceAnswer, coreKeywords, supportingKeywords = [] }) => {
  // Simulate API delay for realism
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (!userAnswer || userAnswer.trim().length === 0) {
    return {
      final_score: 0,
      keyword_score: 0,
      semantic_similarity: 0,
      matched_keywords: [],
      missing_keywords: coreKeywords || [],
      strengths: ["You started answering the question"],
      improvements: ["Please provide a complete answer to the question"],
      word_count: 0,
    };
  }

  // Convert to lowercase for case-insensitive matching
  const lowerAnswer = userAnswer.toLowerCase();
  
  // Handle core keywords (already array from MongoDB)
  const coreKeywordList = Array.isArray(coreKeywords) ? coreKeywords : [];
  
  // Check for core keywords
  const matchedKeywords = [];
  const missingKeywords = [];

  coreKeywordList.forEach(keyword => {
    const lowerKeyword = keyword.toLowerCase();
    if (lowerAnswer.includes(lowerKeyword)) {
      matchedKeywords.push(keyword);
    } else {
      missingKeywords.push(keyword);
    }
  });

  // Calculate keyword score (percentage of core keywords found)
  const keywordScore = coreKeywordList.length > 0 
    ? (matchedKeywords.length / coreKeywordList.length) * 100 
    : 60;

  // Calculate semantic similarity (simplified)
  const semanticSimilarity = calculateSemanticSimilarity(userAnswer, referenceAnswer);
  
  // Calculate final score (weighted: 40% keywords, 60% semantic similarity)
  let finalScoreRaw = (keywordScore * 0.4) + (semanticSimilarity * 0.6);
  finalScoreRaw = Math.max(0, Math.min(100, finalScoreRaw));
  const finalScore = Math.round(finalScoreRaw / 10);
  
  // Generate strengths and improvements
  const strengths = [];
  const improvements = [];

  // Keyword analysis
  if (matchedKeywords.length >= coreKeywordList.length * 0.7) {
    strengths.push(`Excellent coverage of key concepts (${matchedKeywords.length}/${coreKeywordList.length} keywords)`);
  } else if (matchedKeywords.length >= coreKeywordList.length * 0.4) {
    strengths.push(`Good attempt - covered ${matchedKeywords.length} out of ${coreKeywordList.length} key concepts`);
  } else if (matchedKeywords.length > 0) {
    strengths.push(`Identified some key concepts: ${matchedKeywords.join(', ')}`);
  } else {
    improvements.push("Include technical keywords like: " + coreKeywordList.slice(0, 3).join(', '));
  }

  // Semantic similarity analysis
  if (semanticSimilarity > 70) {
    strengths.push("Your answer aligns well with expected response");
  } else if (semanticSimilarity > 50) {
    strengths.push("Response partially matches expected content");
  } else {
    improvements.push("Focus on directly answering the question asked");
  }

  // Word count analysis
  const wordCount = userAnswer.split(/\s+/).filter(w => w.length > 0).length;
  if (wordCount < 25) {
    improvements.push("Provide more detailed answers (aim for 50-150 words)");
  } else if (wordCount > 200) {
    improvements.push("Try to be more concise - focus on quality over quantity");
  } else if (wordCount >= 50 && wordCount <= 150) {
    strengths.push("Optimal answer length - detailed but not overwhelming");
  } else {
    strengths.push("Good answer length");
  }

  // Check for filler words
  const fillerWordList = ["um", "uh", "like", "actually", "basically", "literally", "you know"];
  let fillerCount = 0;
  fillerWordList.forEach(fw => {
    const regex = new RegExp(`\\b${fw}\\b`, 'gi');
    const matches = userAnswer.match(regex);
    if (matches) fillerCount += matches.length;
  });

  if (fillerCount > 5) {
    improvements.push(`Used ${fillerCount} filler words - practice pausing instead`);
  } else if (fillerCount > 2) {
    improvements.push(`Used ${fillerCount} filler words - try to reduce them`);
  } else if (fillerCount > 0) {
    strengths.push(`Good fluency with minimal filler words (only ${fillerCount})`);
  }

  // Missing keywords feedback
  if (missingKeywords.length > 0 && missingKeywords.length <= 3) {
    improvements.push(`Consider adding these key terms: ${missingKeywords.join(', ')}`);
  }

  // Ensure we always have at least one strength and improvement
  if (strengths.length === 0) {
    strengths.push("You completed the answer");
  }
  if (improvements.length === 0) {
    improvements.push("Great answer! Continue practicing to maintain this level");
  }

  return {
    final_score: finalScore,
    final_score_percentage: Math.round(finalScoreRaw),
    keyword_score: Math.round(keywordScore),
    semantic_similarity: Math.round(semanticSimilarity),
    matched_keywords: matchedKeywords,
    missing_keywords: missingKeywords,
    strengths: strengths.slice(0, 3),
    improvements: improvements.slice(0, 3),
    word_count: wordCount,
    filler_word_count: fillerCount,
  };
};

/**
 * Calculates semantic similarity between user answer and reference answer
 * Simplified version - compares word overlap
 */
const calculateSemanticSimilarity = (userAnswer, referenceAnswer) => {
  if (!userAnswer || !referenceAnswer) return 0;
  
  const userLower = userAnswer.toLowerCase();
  const refLower = referenceAnswer.toLowerCase();
  
  const userWords = new Set(userLower.split(/\s+/).filter(w => w.length > 3));
  const refWords = new Set(refLower.split(/\s+/).filter(w => w.length > 3));
  
  const intersection = new Set([...userWords].filter(x => refWords.has(x)));
  const union = new Set([...userWords, ...refWords]);
  
  const similarity = union.size > 0 
    ? (intersection.size / union.size) * 100 
    : 0;
  
  return Math.min(100, Math.max(15, similarity));
};

// Main evaluation function that tries Gemini first, then falls back to local
export const evaluateWithAI = async (params) => {
  // Try Gemini first if API key exists and is not the default placeholder
  if (GEMINI_API_KEY && GEMINI_API_KEY !== "AIzaSyA-f79zib3uKG4a1OKs0mWRDxpvR4rtPvw") {
    try {
      console.log("🤖 Using Gemini AI for evaluation...");
      const result = await evaluateWithGemini(params);
      if (result && result.final_score !== undefined) {
        return result;
      }
    } catch (error) {
      console.error("AI evaluation failed:", error);
    }
  }
  // Fall back to local evaluation
  console.log("📝 Using local evaluation...");
  return evaluateAnswer(params);
};

/**
 * Generate a detailed feedback report
 */
export const generateFeedbackReport = (evaluationResult) => {
  const { final_score, matched_keywords, missing_keywords, strengths, improvements } = evaluationResult;
  
  let report = `╔══════════════════════════════════════════════════════════════╗\n`;
  report += `║              INTERVIEW FEEDBACK REPORT                        ║\n`;
  report += `╚══════════════════════════════════════════════════════════════╝\n\n`;
  
  report += `📊 OVERALL SCORE: ${final_score}/10\n`;
  report += `${'='.repeat(60)}\n\n`;
  
  report += `📝 KEYWORD ANALYSIS:\n`;
  report += `   ✓ Found: ${matched_keywords.join(', ') || 'None'}\n`;
  report += `   ✗ Missing: ${missing_keywords.join(', ') || 'None'}\n\n`;
  
  report += `💪 STRENGTHS:\n`;
  strengths.forEach((s, i) => report += `   ${i + 1}. ${s}\n`);
  
  report += `\n🎯 AREAS FOR IMPROVEMENT:\n`;
  improvements.forEach((i, idx) => report += `   ${idx + 1}. ${i}\n`);
  
  report += `\n💡 TIP: Practice using the STAR method (Situation, Task, Action, Result)\n`;
  report += `   for behavioral questions to structure your answers effectively.\n`;
  
  return report;
};

export default {
  evaluateAnswer,
  evaluateWithGemini,
  evaluateWithAI,
  generateFeedbackReport,
};