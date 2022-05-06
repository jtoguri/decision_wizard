/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM users;`)
      .then(data => {
        const users = data.rows;
        res.json({ users });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  //fake login route sets a cookie
  router.get('/:id/login', (req, res) => {
    res.cookie('user_id', req.params.id)
    .redirect(302, `/api/users/${req.params.id}`);
  });

  //fake logout route removes cookie and redirects to langing page
  router.get('/:id/logout', (req, res) => {
    res.clearCookie('user_id', req.params.id)
    .redirect(302, '/api/polls/');
  });

  router.get("/:id", (req, res) => {
    const currentUserId = req.cookies.user_id;
    const userId = req.params.id;
  
    if (currentUserId !==userId) {
      res.send("Invalid request, you do not have access to this page.");
      return;
    }
    
    const queryString = `
      select polls.*, users.name from polls
        right join users on polls.creator_id = users.id
        where users.id = $1;`;

    const queryParams = [userId];
    
    db.query(queryString, queryParams)
    .then(values => { return values.rows })
    .then(polls => {
      const activePolls = [];
      const completedPolls = [];
    
      const name = polls[0].name;

      for (const poll of polls) {
        if (Number(poll.id) === 0) {
          break; 
        }
        if (Date.parse(poll.end_date) > Date.now()) {
          activePolls.push(poll);
          continue;
        } 
        completedPolls.push(poll);
      }
      const templateVars = { activePolls, completedPolls,  user: userId,
      name };
      res.render("user", templateVars);
    });

  });

  return router;
};
