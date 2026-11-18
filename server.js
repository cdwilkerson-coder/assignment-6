
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const triviaRoutes = require("./routes/triviaRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "Triviabook API is running",
    endpoints: [
      "GET /triviabook/topics",
      "GET /triviabook/topic/:topic",
      "GET /triviabook/random",
      "POST /triviabook/answer",
      "POST /triviabook/question/add"
    ]
  });
});

// Connect the Triviabook routes
app.use("/triviabook", triviaRoutes);

// Handle unknown endpoints
app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint not found"
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Triviabook API running on port ${PORT}`);
});
