import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function useInterviewQuestions(role) {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!role) return;

    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Use the API service to fetch random questions
        const data = await api.getRandomQuestions(role, 10);
        
        // Transform data to match expected format
        const formattedQuestions = data.map(q => ({
          id: q.id,
          question: q.question,
          ideal_answer: q.ideal_answer,
          core_keywords: q.core_keywords,
          supporting_keywords: q.supporting_keywords,
          difficulty: q.difficulty,
          job_role: q.job_role
        }));
        
        setQuestions(formattedQuestions);
        setIndex(0);
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuestions();
  }, [role]);

  const nextQuestion = () => {
    if (index < questions.length - 1) {
      setIndex(index + 1);
    }
  };

  const previousQuestion = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  return {
    question: questions[index],
    index,
    total: questions.length,
    nextQuestion,
    previousQuestion,
    loading,
    error
  };
}