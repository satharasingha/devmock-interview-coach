// API Service for all backend calls
const API_BASE_URL = "http://localhost:3000/api";

export const api = {
  // Questions endpoints
  getQuestions: async (role, difficulty = null, limit = 50) => {
    let url = `${API_BASE_URL}/questions?role=${role}&limit=${limit}`;
    if (difficulty) url += `&difficulty=${difficulty}`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch questions");
    return response.json();
  },
  
  getRandomQuestions: async (role, limit = 10) => {
    const response = await fetch(`${API_BASE_URL}/questions/random/${role}?limit=${limit}`);
    if (!response.ok) throw new Error("Failed to fetch random questions");
    return response.json();
  },
  
  getQuestionById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/questions/${id}`);
    if (!response.ok) throw new Error("Question not found");
    return response.json();
  },
  
  createQuestion: async (questionData) => {
    const response = await fetch(`${API_BASE_URL}/questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(questionData)
    });
    if (!response.ok) throw new Error("Failed to create question");
    return response.json();
  },
  
  updateQuestion: async (id, questionData) => {
    const response = await fetch(`${API_BASE_URL}/questions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(questionData)
    });
    if (!response.ok) throw new Error("Failed to update question");
    return response.json();
  },
  
  deleteQuestion: async (id) => {
    const response = await fetch(`${API_BASE_URL}/questions/${id}`, {
      method: "DELETE"
    });
    if (!response.ok) throw new Error("Failed to delete question");
    return response.json();
  }
};

export default api;