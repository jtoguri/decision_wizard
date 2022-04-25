# Brainstorming ERD Structure

## Tables

users

### Columns
- id (PK)
- name
- email

polls

### Columns
- id (PK)
- question
- admin link
- submission link
- creator id (FK)
- created
- closed
- number of votes
- max votes (optional)
- max time (optional)

choices

### Columns
- id (PK)
- poll id (FK)
- title
- description (optional)
- points

Queries:
- (find the result of a poll) select max points from choices where poll id = polls.id
- (count the number of choices in a poll) select count from choices where poll id = polls.id 

Stretch: Tracking individual poll submissions for a specific user

