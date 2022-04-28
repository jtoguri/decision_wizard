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
    let newPoll;
    let newChoices = [];
    let pollId;
    const question = req.body.question;
    const choices = req.body.choices;
    const choiceCount = Object.keys(choices).length;
    const userId = Number(req.cookies.user_id);

    const pollQueryParams = [ question, userId, choiceCount ];

//  const cookieLocation = req.rawHeaders.length - 1;
//  const cookie = req.rawHeaders[cookieLocation].split(';')[2];
//  const userId = Number(cookie.split('=')[1]);
//    const createPoll = 
//      db.query(`select max(id) from polls;`)
//      .then(data => {
//        pollId =  data.rows[0].max + 1;
//        queryParams.push(`/polls/${pollId}/admin`, `polls/${pollId}`);
//      })
//      .then(() => {
//        return db.query(`insert into polls
//          (question, creator_id, choice_count, admin_link, submission_link)
//          values
//            ($1, $2, $3, $4, $5)
//          returning *;`, queryParams)
//      });

      db.query(`select max(id) from polls;`)
      .then(data => {
        pollId =  data.rows[0].max + 1;
        pollQueryParams.push(`/polls/${pollId}/admin`, `polls/${pollId}`);
      })
      .then(() => {
        db.query(`insert into polls
          (question, creator_id, choice_count, admin_link, submission_link)
          values
            ($1, $2, $3, $4, $5)
          returning *;`, pollQueryParams)
        .then(pollData => {
          newPoll = pollData.rows[0];
        })
        .then(() => {
            let promises = [];
            for (const choice in choices) {
            const title = choices[choice].title;
            const description = choices[choice].describe ?
            choices[choice].describe : null;
            const choiceQueryParams = [ newPoll.id, title, description];
            
            promises.push(
              db.query(`insert into choices
              (poll_id, title, description) values
                ($1, $2, $3)
              returning *;`, choiceQueryParams)
            );
          }
          Promise.all(promises).then(values => {
            for (const value of values) {
              console.log(value.rows);
            }
          })
        });
        //.then(() => {
        //  console.log(newPoll, newChoices);
        //});
      });

//    Promise.all([createPoll]).then(values => console.log(values[0].rows[0]));

    // res.redirect(302, `polls/${pollId}`);
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
