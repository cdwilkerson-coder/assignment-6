
-- CSC 372 Assignment 6 - Triviabook
-- PostgreSQL database schema and seed data
-- Run on a new/empty database

CREATE TABLE IF NOT EXISTS topics (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    topic_id INTEGER NOT NULL REFERENCES topics(id),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    difficulty VARCHAR(10) NOT NULL
        CHECK (difficulty IN ('easy', 'medium', 'hard')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert required topics
INSERT INTO topics (name)
VALUES
    ('science'),
    ('geography')
ON CONFLICT (name) DO NOTHING;

-- Insert required seed questions
INSERT INTO questions (topic_id, question, answer, difficulty)
SELECT t.id, seed.question, seed.answer, seed.difficulty
FROM (
    VALUES
    ('science', 'What planet is known as the Red Planet?', 'Mars', 'easy'),
    ('science', 'What is the chemical symbol for gold?', 'Au', 'medium'),
    ('science', 'What is the powerhouse of the cell?', 'Mitochondria', 'easy'),
    ('geography', 'What is the capital of Australia?', 'Canberra', 'medium'),
    ('geography', 'Which river flows through Cairo?', 'The Nile', 'easy')
) AS seed(topic, question, answer, difficulty)
JOIN topics t ON t.name = seed.topic
WHERE NOT EXISTS (
    SELECT 1
    FROM questions q
    WHERE q.topic_id = t.id AND q.question = seed.question
);
