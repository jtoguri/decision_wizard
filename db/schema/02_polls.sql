-- Drop and recreate polls table

DROP TABLE IF EXISTS polls CASCADE;
CREATE TABLE polls (
  id SERIAL PRIMARY KEY NOT NULL,
  question TEXT NOT NULL,
  admin_link TEXT NOT NULL,
  submission_link TEXT NOT NULL,
  creator_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at DATE NOT NULL,
  closed_at DATE NULL,
  choice_count INT NOT NULL,
  max_time TIMESTAMP NULL
);
