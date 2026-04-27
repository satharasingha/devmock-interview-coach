import mongoose from 'mongoose';
import Question from '../src/models/Question.js ';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/devmock_db')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ Connection error:', err));

// Your questions data (copy-pasted from CSV)
const questionsData = [
  {
    id: 1,
    job_role: "Software Engineer",
    question: "What is Object-Oriented Programming?",
    ideal_answer: "Object-oriented programming is a programming paradigm based on objects that contain data and behavior.",
    core_keywords: ["object", "class"],
    supporting_keywords: ["inheritance", "encapsulation", "polymorphism", "abstraction"],
    difficulty: "Easy",
    type: "theory"
  },
  {
    id: 2,
    job_role: "Software Engineer",
    question: "What is a REST API?",
    ideal_answer: "REST is an architectural style that uses HTTP methods to enable stateless communication between a client and server.",
    core_keywords: ["rest", "http", "stateless"],
    supporting_keywords: ["get", "post", "put", "delete", "client", "server"],
    difficulty: "Easy",
    type: "theory"
  },
  {
    id: 3,
    job_role: "Software Engineer",
    question: "What is polymorphism?",
    ideal_answer: "Polymorphism allows objects to take multiple forms and enables the same interface to behave differently.",
    core_keywords: ["polymorphism"],
    supporting_keywords: ["inheritance", "method overriding", "oop"],
    difficulty: "Medium",
    type: "theory"
  },
  {
    id: 4,
    job_role: "Software Engineer",
    question: "What is encapsulation?",
    ideal_answer: "Encapsulation is the concept of hiding internal data and exposing only necessary functionality.",
    core_keywords: ["encapsulation"],
    supporting_keywords: ["data hiding", "access modifiers", "oop"],
    difficulty: "Easy",
    type: "theory"
  },
  {
    id: 5,
    job_role: "Software Engineer",
    question: "What is inheritance?",
    ideal_answer: "Inheritance allows a class to acquire properties and methods of another class.",
    core_keywords: ["inheritance"],
    supporting_keywords: ["base class", "derived class", "oop"],
    difficulty: "Easy",
    type: "theory"
  },
  {
    id: 6,
    job_role: "Software Engineer",
    question: "What is abstraction?",
    ideal_answer: "Abstraction focuses on exposing essential features while hiding implementation details.",
    core_keywords: ["abstraction"],
    supporting_keywords: ["interfaces", "abstract classes", "oop"],
    difficulty: "Medium",
    type: "theory"
  },
  {
    id: 7,
    job_role: "Software Engineer",
    question: "What is a database index?",
    ideal_answer: "A database index improves query performance by allowing faster data retrieval.",
    core_keywords: ["index"],
    supporting_keywords: ["database", "query optimization", "performance"],
    difficulty: "Medium",
    type: "theory"
  },
  {
    id: 8,
    job_role: "Software Engineer",
    question: "What is version control?",
    ideal_answer: "Version control is a system that tracks changes to source code over time.",
    core_keywords: ["version control"],
    supporting_keywords: ["git", "repository", "commit", "branch"],
    difficulty: "Easy",
    type: "theory"
  },
  {
    id: 9,
    job_role: "Software Engineer",
    question: "What is multithreading?",
    ideal_answer: "Multithreading allows a program to execute multiple threads concurrently.",
    core_keywords: ["multithreading"],
    supporting_keywords: ["concurrency", "parallelism", "threads"],
    difficulty: "Hard",
    type: "theory"
  },
  {
    id: 10,
    job_role: "Software Engineer",
    question: "What is a deadlock?",
    ideal_answer: "A deadlock occurs when multiple processes are unable to proceed because each is waiting for resources held by others.",
    core_keywords: ["deadlock"],
    supporting_keywords: ["concurrency", "resource management", "threads"],
    difficulty: "Hard",
    type: "theory"
  }
];

// Function to import data
async function importData() {
  try {
    // Clear existing questions first (to avoid duplicates)
    await Question.deleteMany({});
    console.log('🗑️  Cleared existing questions');
    
    // Insert new questions
    const result = await Question.insertMany(questionsData);
    console.log(`✅ Successfully imported ${result.length} questions!`);
    
    // Show statistics
    const easyCount = questionsData.filter(q => q.difficulty === 'Easy').length;
    const mediumCount = questionsData.filter(q => q.difficulty === 'Medium').length;
    const hardCount = questionsData.filter(q => q.difficulty === 'Hard').length;
    
    console.log('\n📊 Import Statistics:');
    console.log(`   Easy: ${easyCount} questions`);
    console.log(`   Medium: ${mediumCount} questions`);
    console.log(`   Hard: ${hardCount} questions`);
    
    // Show sample
    console.log('\n📝 Sample Question:');
    console.log(`   ${questionsData[0].question}`);
    console.log(`   Keywords: ${questionsData[0].core_keywords.join(', ')}`);
    
  } catch (error) {
    console.error('❌ Error importing data:', error);
  } finally {
    // Close the connection
    mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the import
importData();