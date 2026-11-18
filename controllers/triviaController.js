
const Trivia = require("../models/triviaModel");

const validDifficulties = ["easy", "medium", "hard"];

// 1. GET all topics
async function getTopics(req, res) {
  try {
    const topics = await Trivia.getTopics();
    res.status(200).json(topics);
  } catch (error) {
    console.error("Error fetching topics:", error.message);
    res.status(500).json({ error: "Failed to retrieve topics" });
  }
}

// 2. GET questions in a topic
async function getQuestionsByTopic(req, res) {
  try {
    const { topic } = req.params;
    const { difficulty, limit } = req.query;

    if (!topic || !topic.trim()) {
      return res.status(400).json({ error: "Topic is required" });
    }

    const existingTopic = await Trivia.findTopic(topic.trim());

    if (!existingTopic) {
      return res.status(404).json({ error: "Topic not found" });
    }

    if (difficulty && !validDifficulties.includes(difficulty)) {
      return res.status(400).json({
        error: "Difficulty must be easy, medium, or hard"
      });
    }

    let parsedLimit;

    if (limit !== undefined) {
      if (!/^[1-9]\d*$/.test(String(limit)) ||
          !Number.isSafeInteger(Number(limit))) {
        return res.status(400).json({
          error: "Limit must be a positive integer"
        });
      }

      parsedLimit = Number(limit);
    }

    const questions = await Trivia.getQuestionsByTopic(
      existingTopic.name,
      difficulty,
      parsedLimit
    );

    res.status(200).json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error.message);
    res.status(500).json({ error: "Failed to retrieve questions" });
  }
}

// 3. GET a random question
async function getRandomQuestion(req, res) {
  try {
    const question = await Trivia.getRandomQuestion();

    if (!question) {
      return res.status(404).json({
        error: "No questions available"
      });
    }

    res.status(200).json(question);
  } catch (error) {
    console.error("Error fetching random question:", error.message);
    res.status(500).json({
      error: "Failed to retrieve random question"
    });
  }
}

// 4. POST check an answer
async function checkAnswer(req, res) {
  try {
    const { id, guess } = req.body || {};

    if (!Number.isInteger(id) || id <= 0 ||
        typeof guess !== "string" || !guess.trim()) {
      return res.status(400).json({
        error: "A valid id and guess are required"
      });
    }

    const question = await Trivia.getAnswerById(id);

    if (!question) {
      return res.status(404).json({
        error: "Question not found"
      });
    }

    const correct =
      guess.trim().toLowerCase() ===
      question.answer.trim().toLowerCase();

    res.status(200).json({
      correct,
      correctAnswer: question.answer
    });
  } catch (error) {
    console.error("Error checking answer:", error.message);
    res.status(500).json({
      error: "Failed to check answer"
    });
  }
}

// 5. POST add a new question
async function addQuestion(req, res) {
  try {
    const { topic, question, answer, difficulty } = req.body || {};

    if (
      typeof topic !== "string" || !topic.trim() ||
      typeof question !== "string" || !question.trim() ||
      typeof answer !== "string" || !answer.trim() ||
      typeof difficulty !== "string" ||
      !validDifficulties.includes(difficulty)
    ) {
      return res.status(400).json({
        error: "Valid topic, question, answer, and difficulty are required"
      });
    }

    const updatedTopic = await Trivia.addQuestion(
      topic.trim(),
      question.trim(),
      answer.trim(),
      difficulty
    );

    res.status(201).json(updatedTopic);
  } catch (error) {
    console.error("Error adding question:", error.message);
    res.status(500).json({
      error: "Failed to add question"
    });
  }
}

module.exports = {
  getTopics,
  getQuestionsByTopic,
  getRandomQuestion,
  checkAnswer,
  addQuestion
};
