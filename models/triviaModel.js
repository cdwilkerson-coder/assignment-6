
const pool = require("../db");

// Get all trivia topics
async function getTopics() {
    const result = await pool.query(
        "SELECT id, name FROM topics ORDER BY name"
    );

    return result.rows;
}

// Get questions for a topic with optional filtering
async function getQuestionsByTopic(topic, difficulty, limit) {
    const values = [topic];

    let query = `
    SELECT q.id, q.question, q.difficulty, t.name AS topic
    FROM questions q
    JOIN topics t ON q.topic_id = t.id
    WHERE LOWER(t.name) = LOWER($1)
  `;

    if (difficulty) {
        values.push(difficulty);
        query += ` AND q.difficulty = $${values.length}`;
    }

    query += " ORDER BY q.id";

    if (limit) {
        values.push(limit);
        query += ` LIMIT $${values.length}`;
    }

    const result = await pool.query(query, values);
    return result.rows;
}

// Get one random question without revealing the answer
async function getRandomQuestion() {
    const result = await pool.query(`
    SELECT q.id, q.question, q.difficulty, t.name AS topic
    FROM questions q
    JOIN topics t ON q.topic_id = t.id
    ORDER BY RANDOM()
    LIMIT 1
  `);

    return result.rows[0] || null;
}

// Retrieve the stored answer for a question
async function getAnswerById(id) {
    const result = await pool.query(
        "SELECT answer FROM questions WHERE id = $1",
        [id]
    );

    return result.rows[0] || null;
}

// Check whether a topic exists
async function findTopic(topic) {
    const result = await pool.query(
        "SELECT id, name FROM topics WHERE LOWER(name) = LOWER($1)",
        [topic]
    );

    return result.rows[0] || null;
}

// Add a new question and create the topic if necessary
async function addQuestion(topic, question, answer, difficulty) {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");


        const topicResult = await client.query(
            `INSERT INTO topics (name)
   VALUES (LOWER($1))
   ON CONFLICT (name)
   DO UPDATE SET name = EXCLUDED.name
   RETURNING id, name`,
            [topic]
        );


        const topicId = topicResult.rows[0].id;

        const questionResult = await client.query(
            `INSERT INTO questions (topic_id, question, answer, difficulty)
       VALUES ($1, $2, $3, $4)
       RETURNING id, question, answer, difficulty`,
            [topicId, question, answer, difficulty]
        );

        const questionsResult = await client.query(
            `SELECT q.id, q.question, q.difficulty
       FROM questions q
       WHERE q.topic_id = $1
       ORDER BY q.id`,
            [topicId]
        );

        await client.query("COMMIT");

        return {
            topic: topicResult.rows[0].name,
            questions: questionsResult.rows
        };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

module.exports = {
    getTopics,
    getQuestionsByTopic,
    getRandomQuestion,
    getAnswerById,
    findTopic,
    addQuestion
};
