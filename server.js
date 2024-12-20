import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import listEndpoints from "express-list-endpoints";

// Load environment variables from env. file
dotenv.config();

// Mongoose schema and model
const thoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
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

// MongoDB connection setup
const mongoUrl = process.env.MONGO_URI; 

mongoose.connect(mongoUrl)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
  });

// Defines the port the app will run on, defaults to 8080
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Route definitions
// Home route showing all endpoints
app.get("/", (req, res) => {
  const endpoints = listEndpoints(app); // Automatically list all endpoints
  res.json({
    message: "Hello and welcome to the Happy Thoughts API! Here are all the available endpoints:",
    endpoints: endpoints
  });
});

// Fetch all thoughts and show the latest 20 thoughts
app.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await Thought.find()
      .sort({ createdAt: -1 }) // Sort in descending order
      .limit(20); // Limit to 20 results

    res.status(200).json(thoughts); // Return thoughts
  } catch (error) {
    res.status(400).json({ error: error.message }); // Handle error
  } 
});

// Create a new thought and save thought including id
app.post("/thoughts", async (req, res) => {
  try {
    const { message } = req.body

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Invalid input. 'message' is required and must be a string" }); // Handle error
    }  

    const thought = new Thought ({ message });
    const savedThought = await thought.save();
  
    res.status(201).json(savedThought);
  } catch (error) {
    console.error("Error saving thought:", error);
    res.status(500).json({ error: "An error occurred while saving the thought"}); // Handle error
  }
});

// Like a thought and save the like
app.post("/thoughts/:thoughtId/like", async (req, res) => {
  try {
    const { thoughtId } = req.params;

    const thought = await Thought.findByIdAndUpdate(
      thoughtId,
      { $inc: { hearts: 1} },
      { new: true }
    );

    if (!thought) {
      return res.status(404).json({ error: "Thought not found." }); // No thought was found with this ID
    }

    // Respond with the updated thought
    res.status(200).json(thought);
  } catch (error) {
    console.error("Error updating hearts:", error.message);
    res.status(500).json({ error: "An error occurred while liking the thought." })
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
