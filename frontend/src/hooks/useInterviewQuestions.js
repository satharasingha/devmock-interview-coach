import { useEffect, useState } from "react";
import Papa from "papaparse";

export default function useInterviewQuestions(role) {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetch("/test.csv")
      .then(res => res.text())
      .then(text => {
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => setQuestions(result.data)
        });
      });
  }, [role]);

  const nextQuestion = () => {
    if (index < questions.length - 1) {
      setIndex(index + 1);
    }
  };

  return {
    question: questions[index],
    index,
    total: questions.length,
    nextQuestion
  };
}
