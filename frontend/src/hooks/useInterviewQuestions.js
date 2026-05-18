import { useEffect, useState } from "react";

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
        // Format the role properly - convert hyphen to space and capitalize
        let formattedRole = role;
        
        // Replace hyphens with spaces
        formattedRole = formattedRole.replace(/-/g, ' ');
        
        // Capitalize each word
        formattedRole = formattedRole.split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
        
        console.log(`Fetching questions for role: ${formattedRole}`);
        
        // Fetch from MongoDB API
        const response = await fetch(`http://localhost:3000/api/questions?role=${encodeURIComponent(formattedRole)}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch questions: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data || data.length === 0) {
          console.warn(`No questions found for role: ${formattedRole}`);
          setError(`No questions found for ${formattedRole}. Please add questions to the database.`);
          setQuestions([]);
        } else {
          // Format the data for your component
          const formattedQuestions = data.map(q => ({
            id: q.id,
            question: q.question,
            ideal_answer: q.ideal_answer,
            core_keywords: q.core_keywords,
            supporting_keywords: q.supporting_keywords,
            difficulty: q.difficulty,
            job_role: q.job_role
          }));
          
          console.log(`Loaded ${formattedQuestions.length} questions for ${formattedRole}`);
          setQuestions(formattedQuestions);
          setIndex(0);
          setError(null);
        }
        
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError(err.message);
        setQuestions([]);
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