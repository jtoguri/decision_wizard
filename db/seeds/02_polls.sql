--Seeding the polls table
INSERT INTO polls 
  (external_uuid, question, admin_link, submission_link, creator_id, created_at,
  closed_at, choice_count) VALUES 
    ('randomString1', 'Where should we go to eat?', 'adminlink1.com', 'sublink1.com', 1,
    '2022-01-08', '2022-01-13', 3);
INSERT INTO polls 
  (external_uuid, question, admin_link, submission_link, creator_id, created_at,
  closed_at, choice_count) VALUES 
    ('randomString2', 'What movie should we see?', 'adminlink2.com', 'sublink2.com', 2,
    '2022-04-26', NULL, 4);
