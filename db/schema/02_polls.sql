-- Drop and recreate polls table

DROP TABLE IF EXISTS polls CASCADE;
CREATE TABLE polls (
  id SERIAL PRIMARY KEY NOT NULL,
  question TEXT NOT NULL,
  admin_link TEXT NOT NULL,
  submission_link TEXT NOT NULL,
  creator_id INT REFERENCES users(id) NOT NULL ON DELETE CASCADE,
  created_at DATE NOT NULL,
  closed_at DATE NULL,
  vote_total INT DEFAULT 0,
  max_votes INT NULL,
  max_time TIMESTAMP NULL
);

