import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import listEndpoints from "list-endpoints-express";

// Load environment variables from env. file
dotenv.config();

// const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
const mongoUrl = process.env.MONGO_URI; // Add mongodb localhost here

mongoose.connect(mongoUrl)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
  });

mongoose.Promise = Promise;

// Mongoose schema and model
const thoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    requires: true,
    minlength: 5,
    maxlength: 140
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Thought = mongoose.model("Thought", thoughtSchema);

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  const endpoints = listEndpoints(app); // Automaticlly list all endpoints
  res.json({
    message: "Hello! Here are all the available endpoints:",
    endpoints: endpoints
  });
});

app.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({ createdAt: -1 }).limit(20);
    res.status(200).json(thoughts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  } 
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
