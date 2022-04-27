# BREAD Routes
🍞 🍞 🍞 🍞 🍞 🍞 

## Poll Routes 

| Name | Path | Verb | Purpose | Serves |
| ---  | ---  | ---  | ------- | ----- |
| Home | /  | GET | catchall | Redirect to /polls |
| Polls | /polls | GET | Display form to create a new poll | index.ejs |
| Create | /polls | POST | Create a new poll | Redirect to /polls/:id |
| View  | /polls/:id | GET | Display a poll  | poll.ejs |
| Admin  | /polls/:id/admin | GET | Display form to update existing poll | edit.ejs |
| Edit  | /polls/:id/edit | POST | Handle poll updates | Redirect to /polls/:id |
| Delete | /polls/:id/delete | POST | Delete a poll | Redirect to /polls |

## User Routes 

| Name | Path | Verb | Purpose | Serves |
| ---  | ---  | ---  | ------- | -----  |
| User | /users | GET | display all users | --- |
| View | /users/:id | GET | Display user info | user.ejs | 
| Login | /users/:id/login | GET | fake login route | redirect to /users/:id |
| Logout | /users/:id/logout | GET | fake logou route | redirect to /polls |


index.ejs
edit.ejs
poll.ejs


