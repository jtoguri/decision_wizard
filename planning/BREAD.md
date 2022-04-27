# BREAD Routes
🍞 🍞 🍞 🍞 🍞 🍞 

## Poll Routes 

| Name | Path | Verb | Purpose | Serves |
| ---  | ---  | ---  | ------- | ----- |
| Polls | /api/polls | GET | Display form to create a new poll | index.ejs |
| Create | /api/polls | POST | Create a new poll | Redirect to /polls/:id |
| View  | /api/polls/:id | GET | Display a poll  | poll.ejs |
| Admin  | /api/polls/:id/admin | GET | Display form to update existing poll | edit.ejs |
| Edit  | /api/polls/:id/edit | POST | Handle poll updates | Redirect to /polls/:id |
| Delete | /api/polls/:id/delete | POST | Delete a poll | Redirect to /polls |

## User Routes 

| Name | Path | Verb | Purpose | Serves |
| ---  | ---  | ---  | ------- | -----  |
| User | /api/users | GET | display all users | --- |
| View | /api/users/:id | GET | Display user info | user.ejs | 
| Login | /api/users/:id/login | GET | fake login route | redirect to /users/:id |
| Logout | /api/users/:id/logout | GET | fake logou route | redirect to /polls |


## templates
index.ejs
edit.ejs
poll.ejs
user.ejs


