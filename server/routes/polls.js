/*
 * All routes for Polls are defined here
 * Since this file is loaded in server.js into api/polls,
 *   these routes are mounted onto /polls
 *
 */

const express = require('express');
const { generateExternalPollId, sendNewResponseMail, sendNewPollMail } = require("../helpers");

const router  = express.Router();


module.exports = (db) => {
  router.get('/', (req, res) => {
    res.render('./index.ejs', {user: req.cookies.user_id});
  });

  // Route to handle the creation of new polls
  router.post('/', (req, res) => {

    // The external poll id is a v4 uuid
    const externalPollId = generateExternalPollId();

    // The admin link is for editing the poll and viewing the final
    // results
    // The submission link is for users to answer the poll
    const adminLink = `api/polls/${externalPollId}/admin`;
    const submissionLink = `api/polls/${externalPollId}`;

    const question = req.body.pollQuestion;

    const choices = req.body.choices;
    const choiceCount = Object.keys(choices).length;

    const userId = Number(req.cookies.user_id);

    const newPollQueryString = `
      INSERT INTO polls
        (external_uuid, question, creator_id, choice_count, admin_link,
          submission_link)
          VALUES
            ($1, $2, $3, $4, $5, $6)
      RETURNING *;`;

    const newPollQueryParams = [
      externalPollId,
      question,
      userId,
      choiceCount,
      adminLink,
      submissionLink
    ];

    db.query(newPollQueryString, newPollQueryParams)

      .then(data => {
        pollData = data.rows[0];
        return pollData;
      })

      .then(({ id, question, creator_id, admin_link, submission_link }) => {
        const newPollid = id;

        // Create an array to hold all the promises returned from the db
        // queries
        let promises = [];

        const newChoiceQueryString = `
        INSERT INTO choices
          (poll_id, title, description) VALUES
            ($1, $2, $3)
        RETURNING *;`;

        for (const choice in choices) {
          const title = choices[choice].title;

          // If the description is an empty string, set it to null
          const description = choices[choice].describe ?
            choices[choice].describe : null;

          const newChoiceQueryParams = [ newPollid, title, description ];

          promises.push(db.query(
            newChoiceQueryString, newChoiceQueryParams));
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
            choices: newChoices,
            submissionLink: submission_link,
            adminLink: admin_link
          };

          console.log(responseData);

          res.json(responseData);
        });


      });
  });

  router.get('/:id', (req, res) => {

    const externalPollId = req.params.id;

    const findPollQueryString = `
      SELECT id, question FROM polls
        WHERE external_uuid = $1;`;

    const findPollQueryParams = [externalPollId];

    const findChoicesQueryString = `
      SELECT id, title, description FROM choices
        WHERE poll_id = $1;`;

    db.query(findPollQueryString, findPollQueryParams)
      .then(pollData => pollData.rows[0])
      .then(({ id, question }) => {
        const findChoicesQueryParams = [id];
        db.query(findChoicesQueryString, findChoicesQueryParams)
          .then(choiceData => choiceData.rows)
          .then(choices => {
            console.log(choices);
            const templateVars = {
              poll: {
                question
              },
              choices,
              user: req.cookies.user_id
            };

            res.render('./poll.ejs', templateVars);
          });
      });
  });

  router.get('/:id/admin', (req, res) => {
    res.send('display admin page for existing poll');
  });

  router.post('/:id', (req, res) => {

    const ranking = req.body.choice;
    const userId = req.cookies.user_id ? Number(req.cookies.user_id)
      : null;

    let queryString = `
      INSERT INTO votes
        (choice_id, user_id, position) VALUES
          `;

    const queryParams = [];

    let queryString2 = `
      SELECT choices.id, choices.title, SUM(choice_count-position) AS score FROM votes
        JOIN choices ON choices.id = votes.choice_id
        JOIN polls ON polls.id = choices.poll_id
          WHERE choice_id IN (`;

    const queryParams2 = [];

    for (let i = 0; i < ranking.length; i++) {
      const choiceId = Number(ranking[i]);
      const position = i + 1;

      queryParams.push(choiceId, userId, position);
      queryParams2.push(choiceId);

      const count = queryParams.length;

      queryString += `($${count - 2}, $${count - 1}, $${count})`;

      queryString2 += `$${i + 1}`;

      if (i < ranking.length - 1) {
        queryString += ', ';
        queryString2 += ', ';
      }
    }

    queryString += `\n  RETURNING *;`;
    queryString2 += ') GROUP BY choices.id ORDER BY score DESC;';

    queryString3 = `SELECT email, polls.external_uuid as id, question FROM polls
    JOIN users on polls.creator_id = users.id
    WHERE polls.external_uuid = $1`;

    queryParams3 = [`${req.params.id}`];

    db.query(queryString, queryParams)
      .then((data) => {
        console.log(data.rows);
      })
      .then(() => {
        return db.query(queryString2, queryParams2);
      })
      .then(data2 => {
        res.json(data2.rows);
      })
      .then(() => {
        return db.query(queryString3, queryParams3);
      })
      .then(data3 => {
        sendNewResponseMail(data3);
        //do things with mailgun
      });


  });

  router.post('/:id/delete', (req, res) => {
    console.log('post route to delete a poll');
  });
  return router;

};





// db.query(queryString, queryParams)
// .then(data => console.log(data.rows))
// .then(() => {
//   return db.query(queryString2, queryParams2);
// })
// .then(data2 => {
//   console.log(data2.rows);
//   res.json(data2.rows);
// });
// });
