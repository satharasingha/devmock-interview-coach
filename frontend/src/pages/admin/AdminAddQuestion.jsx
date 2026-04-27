import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Plus, Trash2, Save, X, CheckCircle, AlertCircle } from "lucide-react";

export default function AdminAddQuestion() {
  const [formData, setFormData] = useState({
    id: "",
    job_role: "Software Engineer",
    question: "",
    ideal_answer: "",
    core_keywords: [],
    supporting_keywords: [],
    difficulty: "Easy",
    type: "theory"
  });

  const [keywordInput, setKeywordInput] = useState("");
  const [supportingKeywordInput, setSupportingKeywordInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Add core keyword
  const addCoreKeyword = () => {
    if (keywordInput.trim() && !formData.core_keywords.includes(keywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        core_keywords: [...prev.core_keywords, keywordInput.trim()]
      }));
      setKeywordInput("");
    }
  };

  // Remove core keyword
  const removeCoreKeyword = (keyword) => {
    setFormData(prev => ({
      ...prev,
      core_keywords: prev.core_keywords.filter(k => k !== keyword)
    }));
  };

  // Add supporting keyword
  const addSupportingKeyword = () => {
    if (supportingKeywordInput.trim() && !formData.supporting_keywords.includes(supportingKeywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        supporting_keywords: [...prev.supporting_keywords, supportingKeywordInput.trim()]
      }));
      setSupportingKeywordInput("");
    }
  };

  // Remove supporting keyword
  const removeSupportingKeyword = (keyword) => {
    setFormData(prev => ({
      ...prev,
      supporting_keywords: prev.supporting_keywords.filter(k => k !== keyword)
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    // Validation
    if (!formData.question || !formData.ideal_answer) {
      setMessage({ type: "error", text: "Please fill in question and answer" });
      setLoading(false);
      return;
    }

    try {
      // CHANGE THIS URL TO PORT 3000
      const response = await fetch("http://localhost:3000/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Question added successfully!" });
        // Reset form
        setFormData({
          id: "",
          job_role: "Software Engineer",
          question: "",
          ideal_answer: "",
          core_keywords: [],
          supporting_keywords: [],
          difficulty: "Easy",
          type: "theory"
        });
        setKeywordInput("");
        setSupportingKeywordInput("");
      } else {
        setMessage({ type: "error", text: data.message || "Failed to add question" });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage({ type: "error", text: "Server error. Please make sure backend is running on port 3000" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Add New Question</h1>
          <p className="text-gray-600 mt-1">Add interview questions to the database</p>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            message.type === "success" 
              ? "bg-green-50 border border-green-200 text-green-700" 
              : "bg-red-50 border border-red-200 text-red-700"
          }`}>
            {message.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100">
          {/* Basic Information */}
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Question ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question ID
                </label>
                <input
                  type="number"
                  name="id"
                  value={formData.id}
                  onChange={handleChange}
                  placeholder="Auto-generated if empty"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty for auto-generation</p>
              </div>

              {/* Job Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Role *
                </label>
                <select
                  name="job_role"
                  value={formData.job_role}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Software Engineer">Software Engineer</option>
                  <option value="Data Scientist">Data Scientist</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="DevOps Engineer">DevOps Engineer</option>
                  <option value="Product Manager">Product Manager</option>
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Difficulty *
                </label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              {/* Question Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="theory">Theory Question</option>
                  <option value="coding">Coding Question</option>
                </select>
              </div>
            </div>

            {/* Question Text */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Question *
              </label>
              <textarea
                name="question"
                value={formData.question}
                onChange={handleChange}
                rows={3}
                placeholder="Enter the interview question..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Ideal Answer */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ideal Answer *
              </label>
              <textarea
                name="ideal_answer"
                value={formData.ideal_answer}
                onChange={handleChange}
                rows={5}
                placeholder="Enter the ideal/correct answer..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Keywords Section */}
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Keywords</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Core Keywords */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Core Keywords
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addCoreKeyword()}
                    placeholder="Add keyword and press Enter"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={addCoreKeyword}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.core_keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {keyword}
                      <button
                        type="button"
                        onClick={() => removeCoreKeyword(keyword)}
                        className="hover:text-blue-900"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Essential keywords that must be in the answer
                </p>
              </div>

              {/* Supporting Keywords */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supporting Keywords
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={supportingKeywordInput}
                    onChange={(e) => setSupportingKeywordInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSupportingKeyword()}
                    placeholder="Add keyword and press Enter"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={addSupportingKeyword}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.supporting_keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                    >
                      {keyword}
                      <button
                        type="button"
                        onClick={() => removeSupportingKeyword(keyword)}
                        className="hover:text-green-900"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Additional keywords that add value to the answer
                </p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="p-6 flex gap-4 justify-end">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  id: "",
                  job_role: "Software Engineer",
                  question: "",
                  ideal_answer: "",
                  core_keywords: [],
                  supporting_keywords: [],
                  difficulty: "Easy",
                  type: "theory"
                });
                setKeywordInput("");
                setSupportingKeywordInput("");
              }}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Clear Form
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Question
                </>
              )}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}