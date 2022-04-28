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
    const question = req.body.question;
    const choices = req.body.choices;
    const choiceCount = Object.keys(choices).length;
    const userId = Number(req.cookies.user_id);

    const pollQueryParams = [ question, userId, choiceCount ];

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
          return pollData.rows[0];
        })
        .then( ({ id, question }) => {
            const newPollid = id;

            let promises = [];
            for (const choice in choices) {
              const title = choices[choice].title;
              const description = choices[choice].describe ?
                choices[choice].describe : null;
              const choiceQueryParams = [ newPollid, title, description];
            
              promises.push(
                db.query(`insert into choices
                  (poll_id, title, description) values
                    ($1, $2, $3)
                  returning *;`, choiceQueryParams)
              );
            }
          
            let newChoices = [];

            Promise.all(promises).then(values => {
              for (const value of values) {
                newChoices.push({ 
                  title: value.rows[0].title,
                  description: value.rows[0].description
                });
              }
              const responseData = {
                question: question,
                choices: newChoices
              };
              console.log(responseData);
              res.json(responseData);
            })
        });
      });

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
