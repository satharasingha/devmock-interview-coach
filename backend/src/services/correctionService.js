import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Corrects speech-to-text errors using Groq API
 */
export const correctTranscript = async (rawTranscript, context) => {
  if (!rawTranscript || rawTranscript.trim().length === 0) {
    return rawTranscript;
  }

  try {
    const prompt = `You are a speech-to-text correction assistant for technical interviews.

CONTEXT: ${context}
RAW TRANSCRIPT: "${rawTranscript}"

COMMON TECHNICAL TERMS TO CORRECT:
- "froent" / "fro-end" / "frond" → "frontend"
- "back" / "back-end" / "bac end" → "backend"
- "reack" / "reacted" → "React"
- "javashit" / "java script" → "JavaScript"
- "type script" → "TypeScript"
- "reack native" → "React Native"
- "node.js" / "nodejs" → "Node.js"
- "express.js" / "expressjs" → "Express.js"
- "mongo db" → "MongoDB"
- "post grey sequel" → "PostgreSQL"
- "my sequel" → "MySQL"
- "api s" → "APIs"
- "algorithm" → "algorithm"
- "dada base" → "database"

RULES:
1. Fix technical term spelling errors
2. Add proper punctuation (periods at end of sentences)
3. Capitalize first letter of sentences
4. Fix common grammar issues
5. Keep the original meaning intact

Return ONLY the corrected transcript, nothing else. Do not add explanations or markdown.

CORRECTED TRANSCRIPT:`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are a technical speech-to-text correction expert. Return only the corrected text.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.1,
      max_tokens: 500,
    });

    const corrected = completion.choices[0]?.message?.content || rawTranscript;
    console.log(`Original: "${rawTranscript}"`);
    console.log(`Corrected: "${corrected}"`);

    return corrected.trim();
  } catch (error) {
    console.error("Groq correction error:", error.message);
    return rawTranscript; // Fallback to original
  }
};

/**
 * Quick correction without API call (for simple cases)
 */
export const quickCorrect = (text) => {
  const corrections = {
    froent: "frontend",
    "fro-end": "frontend",
    frond: "frontend",
    fontend: "frontend",
    back: "backend",
    "back-end": "backend",
    bacend: "backend",
    reack: "React",
    reacted: "React",
    javashit: "JavaScript",
    "java script": "JavaScript",
    "type script": "TypeScript",
    typescript: "TypeScript",
    nodejs: "Node.js",
    expressjs: "Express.js",
    mongodb: "MongoDB",
    postgresql: "PostgreSQL",
    mysql: "MySQL",
    "api s": "APIs",
  };

  let corrected = text;
  for (const [wrong, correct] of Object.entries(corrections)) {
    const regex = new RegExp(`\\b${wrong}\\b`, "gi");
    corrected = corrected.replace(regex, correct);
  }

  return corrected;
};

export default { correctTranscript, quickCorrect };
