import { useEffect, useState } from "react";
import Papa from "papaparse";

export default function InterviewTest() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch("/test.csv")
      .then((res) => res.text())
      .then((text) => {
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (data) => {
            setQuestions(data.data);
          },
        });
      });
  }, []);

  if (questions.length === 0) {
    return <p className="p-6">Loading questions...</p>;
  }

  const current = questions[currentIndex];

  const evaluateAnswer = () => {
    const userText = answer.toLowerCase();

    const coreKeywords = current.core_keywords
      .split(";")
      .map((k) => k.trim());

    const supportingKeywords = current.supporting_keywords
      .split(";")
      .map((k) => k.trim());

    let score = 0;
    let matchedCore = [];
    let missingCore = [];
    let matchedSupporting = [];

    coreKeywords.forEach((kw) => {
      if (userText.includes(kw)) {
        score += 2;
        matchedCore.push(kw);
      } else {
        missingCore.push(kw);
      }
    });

    supportingKeywords.forEach((kw) => {
      if (userText.includes(kw)) {
        score += 1;
        matchedSupporting.push(kw);
      }
    });

    setResult({
      score,
      matchedCore,
      missingCore,
      matchedSupporting,
    });
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Interview Practice</h1>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <p className="text-sm text-gray-500 mb-2">
            Role: {current.job_role}
          </p>

          <h2 className="text-lg font-semibold mb-4">
            {current.question}
          </h2>

          <textarea
            className="w-full border rounded-lg p-3 mb-4"
            rows={5}
            placeholder="Type your answer here..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />

          <button
            onClick={evaluateAnswer}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Submit Answer
          </button>
        </div>

        {result && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Evaluation Result</h3>

            <p className="mb-2">
              <strong>Score:</strong> {result.score}
            </p>

            <p className="mb-2 text-green-600">
              <strong>Matched Core Keywords:</strong>{" "}
              {result.matchedCore.join(", ") || "None"}
            </p>

            <p className="mb-2 text-red-600">
              <strong>Missing Core Keywords:</strong>{" "}
              {result.missingCore.join(", ") || "None"}
            </p>

            <p className="text-blue-600">
              <strong>Matched Supporting Keywords:</strong>{" "}
              {result.matchedSupporting.join(", ") || "None"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
