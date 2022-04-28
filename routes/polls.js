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
    res.render('./index.ejs');
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

  router.post('/', (req, res) => {
    let pollId;
    const question = req.body.pollQuestion;
    const choice_count = (Object.keys(req.body).length - 1) / 2;
    const userId = req.cookies.user_id;
    console.log(req.body);

//    const cookieLocation = req.rawHeaders.length - 1;
//    const cookie = req.rawHeaders[cookieLocation].split(';')[2];
//    const userId = Number(cookie.split('=')[1]);
//    console.log(userId);

    db.query(`select max(id) from polls;`)
    .then(data => {
      pollId =  data.rows[0].max + 1})
    .then(() => {
      db.query(`insert into polls
        (question, admin_link, submission_link, creator_id,
        choice_count) values
          ($1, $2, $3, $4, $5)
        returning *;`, [question,
          `/polls/${pollId}/admin`, `/polls/${pollId}`, userId, choice_count]
      ).then(data => console.log(data.rows[0]))});

    res.redirect(302, `polls/${pollId}`);
  });

  router.get('/:id', (req, res) => {
    res.send('display a single poll');
  });

  router.get('/:id/admin', (req, res) => {
    res.send('display admin page for existing poll');
  });

  router.post('/:id/edit', (req, res) => {
    console.log('post route to edit a poll');
  });

  router.post('/:id/delete', (req, res) => {
    console.log('post route to delete a poll');
  });
  return router;

};
