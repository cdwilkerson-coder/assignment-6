
const express = require("express");
const router = express.Router();

const triviaController = require("../controllers/triviaController");

// 1. Get all trivia topics
router.get("/topics", triviaController.getTopics);

// 2. Get questions by topic
router.get("/topic/:topic", triviaController.getQuestionsByTopic);

// 3. Get a random question
router.get("/random", triviaController.getRandomQuestion);

// 4. Check an answer
router.post("/answer", triviaController.checkAnswer);

// 5. Add a new question
router.post("/question/add", triviaController.addQuestion);

module.exports = router;
