import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Cache for Groq responses
const responseCache = new Map();
const CACHE_TTL = 3600000; // 1 hour

const isInvalidAnswer = (userAnswer) => {
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
    "i'm not familiar",
    "i am not familiar",
    "not familiar",
    "i haven't learned",
    "i haven't studied",
    "i'm not confident",
    "i am not confident",
    "i don't recall",
    "i don't remember",
    "i'm not comfortable",
    "i am not comfortable",
  ];
  const lowerAnswer = userAnswer.toLowerCase();
  return invalidPhrases.some((phrase) => lowerAnswer.includes(phrase));
};

const isAnswerTooShort = (userAnswer) => {
  const wordCount = userAnswer.trim().split(/\s+/).length;
  return wordCount < 5;
};

export const evaluateWithGroq = async (
  userAnswer,
  referenceAnswer,
  coreKeywords,
) => {
  if (!process.env.GROQ_API_KEY) {
    console.warn("GROQ_API_KEY not found");
    return null;
  }

  if (isInvalidAnswer(userAnswer)) {
    return {
      final_score: 1,
      semantic_similarity: 10,
      matched_keywords: [],
      missing_keywords: coreKeywords || [],
      strengths: ["You acknowledged you don't know the answer"],
      improvements: ["Review the reference answer to learn this concept"],
      corrected_answer: referenceAnswer,
      evaluation_method: "precheck_invalid",
    };
  }

  if (isAnswerTooShort(userAnswer)) {
    return {
      final_score: 2,
      semantic_similarity: 20,
      matched_keywords: [],
      missing_keywords: coreKeywords || [],
      strengths: ["You provided an answer"],
      improvements: [
        "Provide more detailed answers",
        `Include keywords like: ${coreKeywords?.slice(0, 3).join(", ")}`,
      ],
      corrected_answer: referenceAnswer,
      evaluation_method: "precheck_too_short",
    };
  }

  try {
    const cacheKey = `${userAnswer.substring(0, 200)}_${referenceAnswer.substring(0, 200)}`;
    if (responseCache.has(cacheKey)) {
      const cached = responseCache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }
      responseCache.delete(cacheKey);
    }

    // FIXED PROMPT - Only fix grammar, no long explanations
    const prompt = `You are a technical interview assistant. Fix grammar and spelling errors in the candidate's answer.

TASK:
1. Fix grammar and spelling errors in the candidate's answer
2. Keep the answer SHORT and SIMPLE (same length as original)
3. DO NOT add new information or long explanations
4. DO NOT write a perfect answer - just correct the grammar

QUESTION: ${referenceAnswer}
CANDIDATE'S RAW ANSWER: "${userAnswer}"
KEY CONCEPTS: ${coreKeywords?.join(", ") || "None"}

EXAMPLE:
Raw: "react js is fron and library"
Corrected: "React js is a frontend library"

Return ONLY valid JSON:
{
  "score": <integer 0-10>,
  "corrected_answer": "<grammar-fixed version only, no extra text>",
  "matched_keywords": ["keyword1"],
  "missing_keywords": ["keyword2"],
  "strengths": ["strength1"],
  "improvements": ["improvement1"]
}

SCORING RULES (based on CORRECTED answer):
- Score 7-8: Good understanding, mentioned key concepts
- Score 5-6: Basic understanding, missing some key concepts  
- Score 3-4: Poor understanding, missing most key concepts
- Score 0-2: Wrong answer or no understanding

Be FAIR - if the corrected answer is correct, give 7-8/10.`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You fix grammar in technical answers. Keep answers short. Return only valid JSON. Do not add explanations.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.1,
      max_tokens: 500,
    });

    const resultText = completion.choices[0]?.message?.content;
    console.log("Groq response:", resultText?.substring(0, 200));

    let result;
    const jsonMatch = resultText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      result = JSON.parse(jsonMatch[0]);
    } else {
      result = JSON.parse(resultText);
    }

    let score = result.score || 5;
    score = Math.min(10, Math.max(0, score));

    const correctedAnswer = result.corrected_answer || userAnswer;

    const evaluatedResult = {
      final_score: score,
      semantic_similarity: score * 10,
      matched_keywords: result.matched_keywords || [],
      missing_keywords: result.missing_keywords || coreKeywords || [],
      strengths: result.strengths || ["You provided an answer"],
      improvements: result.improvements || ["Review the corrected answer above"],
      corrected_answer: correctedAnswer,
      original_answer: userAnswer,
      evaluation_method: "groq",
    };

    responseCache.set(cacheKey, {
      data: evaluatedResult,
      timestamp: Date.now(),
    });

    console.log(`Groq evaluation - Score: ${evaluatedResult.final_score}/10`);
    return evaluatedResult;
  } catch (error) {
    console.error("Groq API error:", error.message);
    return null;
  }
};

export default { evaluateWithGroq };