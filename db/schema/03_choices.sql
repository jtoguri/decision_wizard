-- Drop and recreate choices table

DROP TABLE IF EXISTS choices CASCADE;
CREATE TABLE choices (
  id SERIAL PRIMARY KEY NOT NULL,
  poll_id INT NOT NULL REFERENCES polls ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NULL
);
