
# Assignment 6: Triviabook API

**Student:** Cameron Wilkerson  
**Course:** CSC 372 – Web Development  
**Assignment:** Assignment 6 – Node.js / Express CRUD API

## Project Overview

Triviabook is a RESTful trivia question API built with
Node.js, Express.js, and PostgreSQL.

Users can retrieve trivia topics, search questions by topic
and difficulty, get random questions, check answers,
and add new questions.

The application uses Neon PostgreSQL for persistent
database storage and follows a Model–Controller–Router
architecture.

## Technologies Used

- JavaScript
- Node.js
- Express.js
- PostgreSQL (Neon)
- node-postgres (pg)
- dotenv
- cors
- Render
- Git and GitHub

## Project Structure

controllers/triviaController.js - Request handling and validation

models/triviaModel.js - PostgreSQL database queries

routes/triviaRoutes.js - API endpoint definitions

database/seed.sql - Database schema and initial data

db.js - Neon PostgreSQL connection

server.js - Express server configuration

## Database Schema

### topics

- id: SERIAL PRIMARY KEY
- name: VARCHAR(100), NOT NULL, UNIQUE

### questions

- id: SERIAL PRIMARY KEY
- topic_id: INTEGER, foreign key referencing topics(id)
- question: TEXT, NOT NULL
- answer: TEXT, NOT NULL
- difficulty: VARCHAR(10), NOT NULL
- created_at: TIMESTAMP

Difficulty must be easy, medium, or hard.

## API Endpoints

### GET /triviabook/topics

Returns all available trivia topics.

### GET /triviabook/topic/:topic

Returns questions for a specified topic.

Optional query parameters:
- difficulty: easy, medium, hard
- limit: positive integer

Example:
/triviabook/topic/science?difficulty=easy&limit=1

### GET /triviabook/random

Returns one random question without revealing its answer.

### POST /triviabook/answer

Checks whether a submitted answer is correct.

Example request body:

{
  "id": 1,
  "guess": "Mars"
}

### POST /triviabook/question/add

Adds a new question and creates the topic if necessary.

Example request body:

{
  "topic": "computer science",
  "question": "What does CPU stand for?",
  "answer": "Central Processing Unit",
  "difficulty": "easy"
}

## Installation and Setup

1. Clone the repository.
2. Run `npm install`.
3. Create a Neon PostgreSQL database.
4. Create a `.env` file containing:

   DATABASE_URL=your_neon_connection_string
   PORT=3000

5. Execute `database/seed.sql` in the Neon SQL Editor.
6. Start the application:

   node server.js

7. Visit http://localhost:3000

## Error Handling

The API validates required parameters and returns
appropriate HTTP status codes:

- 200: Successful request
- 201: Resource created
- 400: Invalid or missing request parameters
- 404: Resource not found
- 500: Internal server error

## Deployment

The Triviabook API is deployed on Render and uses
Neon PostgreSQL for persistent database storage.

**Live API:** https://cam-triviabook-api.onrender.com

**Test Endpoint:** https://cam-triviabook-api.onrender.com/triviabook/topics

## Repository

https://github.com/cdwilkerson-coder/assignment-6
