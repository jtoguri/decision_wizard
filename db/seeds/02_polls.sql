--Seeding the polls table
INSERT INTO polls 
  (question, admin_link, submission_link, creator_id, created_at, closed_at, vote_total) VALUES 
    ('Where should we go to eat?', 'adminlink1.com', 'sublink1.com', 1,
    '2022-01-08', '2022-01-13', 7);
INSERT INTO polls 
  (question, admin_link, submission_link, creator_id, created_at,
  closed_at, vote_total, max_votes) VALUES 
    ('What movie should we see?', 'adminlink2.com', 'sublink2.com', 2,
    '2022-04-26', NULL, 3, 5);
