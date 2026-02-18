import express from "express";
import mongoose from "mongoose";
import userRouter from "./src/routes/userRouter.js";

const app = express();

const mongodbURI =
  "mongodb://localhost:27017/devmock_database";

mongoose.connect(mongodbURI).then(() => {
  console.log("Connected to MongoDB");
});

app.use(express.json());
app.listen(3000, (req, res) => {
  console.log("Server is running on port 3000");
});

app.use("/users",userRouter)