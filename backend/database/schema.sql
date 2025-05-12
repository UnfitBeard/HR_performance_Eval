-- Users: id, name, role, department, email, etc.

-- Reviews: id, employee_id, reviewer_id, cycle, date, summary, score


CREATE TABLE Users (
	id SERIAL PRIMARY KEY,
	name VARCHAR(20) UNIQUE NOT NULL,
	role VARCHAR(20) NOT NULL CHECK (role IN ('employee', 'manager', 'admin')),
	department VARCHAR(40) NOT NULL,
	email VARCHAR(40) UNIQUE NOT NULL
)

CREATE TABLE Reviews (
	id SERIAL PRIMARY KEY,
	employee_id INT REFERENCES users(id) ON DELETE CASCADE,
	reviewer_id INT REFERENCES users(id) ON DELETE CASCADE,
	date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	summary TEXT,
	score SMALLINT CHECK (score BETWEEN 1 AND 10)
)
-- Goals: id, user_id, description, target_date, progress

CREATE TABLE Goals (
	id SERIAL PRIMARY KEY,	
	user_id INT REFERENCES users(id) ON DELETE CASCADE,
	description TEXT,
	target_date VARCHAR(50),
	progress INT CHECK (progress BETWEEN 1 AND 100)
)

-- Feedback: id, sender_id, receiver_id, type (peer/self/manager), message

CREATE TABLE Feedback (
	id SERIAL PRIMARY KEY,
	sender_id INT REFERENCES users(id) ON DELETE CASCADE,
	receiver_id INT REFERENCES users(id) ON DELETE CASCADE,
	type VARCHAR(50) CHECK (type IN ('peer', 'self', 'manager')),
	message TEXT
)

-- Questions: id, category (self, peer), text

CREATE TABLE Questions (
	id SERIAL PRIMARY KEY,
	category VARCHAR(50) CHECK (category IN ('self', 'peer')),
	text TEXT
)

-- Answers: id, question_id, review_id, response