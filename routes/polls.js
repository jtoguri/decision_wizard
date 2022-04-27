/*
 * All routes for Polls are defined here
 * Since this file is loaded in server.js into api/polls,
 *   these routes are mounted onto /polls
 *
 */

const express = require('express');
const router  = express.Router();


module.exports = (db) => {
  router.get('/', (req, res) => {
    res.send('display all public polls here');
    // db.query(`SELECT * FROM polls;`)
    //   .then(data => {
    //     const polls = data.rows;
    //     res.json({ polls });
    //   })
    //   .catch(err => {
    //     res
    //       .status(500)
    //       .json({ error: err.message });
    //   });
  });

  //routes for /polls/new
  router.get('/new', (req, res) => {

    
    res.send('diplay form to create a new poll');
  });

  router.post('/', (req, res) => {
    //assuming no method override? 
    let pollId;
    const question = req.body.pollQuestion;
    const user_id = 1;
    const choice_count = (Object.keys(req.body).length - 1) / 2;
    
    db.query(`select max(id) from polls;`)
    .then(data => {
      pollId =  data.rows[0].max + 1})
    .then(() => {
      db.query(`insert into polls
        (question, admin_link, submission_link, creator_id,
        choice_count) values
          ($1, $2, $3, $4, $5)
        returning *;`, [question,
          `/polls/${pollId}`, `/polls/${pollId}`, user_id, choice_count]
      ).then(data => console.log(data.rows[0]))});

    // console.log(req.body);
  });

  // routes for /polls/:id
  router.get('/:id', (req, res) => {
    res.send('display a single poll');
  });

  router.get('/:id/edit', (req, res) => {
    res.send('display form to edit an existing poll');
  });

  router.post('/:id/edit', (req, res) => {
    console.log('post route to edit a poll');
  });

  router.post('/:id/delete', (req, res) => {
    console.log('post route to delete a poll');
  });
  return router;

};
