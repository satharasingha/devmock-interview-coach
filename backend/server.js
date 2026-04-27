import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import questionRoutes from "./src/routes/questionsRouter.js";

const app = express();

const mongodbURI = "mongodb://localhost:27017/devmock_database";

// Connect to MongoDB
mongoose.connect(mongodbURI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });

// CORS 
app.use(cors());  
// Middleware
app.use(express.json());

// Routes

app.use("/api/questions", questionRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({ message: "DevMock API is running!" });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});