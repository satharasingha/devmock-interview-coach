import dotenv from "dotenv";
import { evaluateWithGroq } from "./src/services/groqService.js";

dotenv.config();

const testGroq = async () => {
  console.log("Testing Groq API...");
  console.log("API Key exists:", !!process.env.GROQ_API_KEY);

  const userAnswer =
    "Object-oriented programming is a programming paradigm that uses objects and classes to organize code.";
  const referenceAnswer =
    "OOP is a paradigm based on objects containing data and methods.";
  const keywords = ["object", "class", "paradigm"];

  const result = await evaluateWithGroq(userAnswer, referenceAnswer, keywords);

  if (result) {
    console.log("Groq API working!");
    console.log("Score:", result.final_score);
    console.log("Strengths:", result.strengths);
    console.log("Improvements:", result.improvements);
  } else {
    console.log("Groq API failed");
  }
};

testGroq();
