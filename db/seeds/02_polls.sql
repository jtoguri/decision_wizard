--Seeding the polls table
INSERT INTO polls 
  (external_uuid, question, admin_link, submission_link, creator_id, created_at,
  closed_at, choice_count) VALUES 
    ('randomString1', 'Where should we go to eat?',
    '/api/polls/randomString1/admin', '/api/polls/randomString1', 1,
    '2022-01-08', '2022-01-13', 3);
INSERT INTO polls 
  (external_uuid, question, admin_link, submission_link, creator_id, created_at,
  closed_at, choice_count) VALUES 
    ('randomString2', 'What movie should we see?',
    '/api/polls/randomString2/admin', '/api/polls/randomString2', 2,
    '2022-04-26', NULL, 4);
