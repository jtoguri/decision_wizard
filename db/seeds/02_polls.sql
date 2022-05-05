--Seeding the polls table
-- INSERT INTO polls
--   (external_uuid, question, admin_link, submission_link, creator_id, created_at,
--   closed_at, choice_count) VALUES
--     ('randomString1', 'Where should we go to eat?',
--     'api/polls/randomString1/admin', 'api/polls/randomString1', 1,
--     '2022-01-08', '2022-01-13', 3);
-- INSERT INTO polls
--   (external_uuid, question, admin_link, submission_link, creator_id, created_at,
--   closed_at, choice_count) VALUES
--     ('randomString2', 'What movie should we see?',
--     'api/polls/randomString2/admin', 'api/polls/randomString2', 2,
--     '2022-04-26', NULL, 4);

INSERT INTO polls
  (external_uuid, question, admin_link, submission_link, creator_id, created_at,
  end_date, closed_at, choice_count) VALUES
    ('food', 'Where should we go to eat?',
    'api/polls/food/admin', 'api/polls/food', 1,
    '2022-01-13', '2022-01-08', '2022-01-13', 3);
INSERT INTO polls
  (external_uuid, question, admin_link, submission_link, creator_id, created_at,
  end_date, closed_at, choice_count) VALUES
    ('movies', 'What movie should we see?',
    'api/polls/movies/admin', 'api/polls/movies', 2,
    '2022-04-26', '2022-06-26', NULL, 4);
INSERT INTO polls
  (external_uuid, question, admin_link, submission_link, creator_id, created_at,
  end_date, closed_at, choice_count) VALUES
    ('bears', 'Which Bear is Best?', 'api/polls/bears/admin', 'api/polls/bears', 3,
    '2022-5-01', '2022-5-11', NULL, 3);
INSERT INTO polls
  (external_uuid, question, admin_link, submission_link, creator_id, created_at,
  end_date, closed_at, choice_count) VALUES
    ('cars', 'Which car is Best?', 'api/polls/cars/admin', 'api/polls/cars', 3,
    '2022-5-01', '2022-5-05', NULL, 3);
