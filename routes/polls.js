/*
 * All routes for Polls are defined here
 * Since this file is loaded in server.js into api/polls,
 *   these routes are mounted onto /polls
 *
 */

const express = require('express');
const { generateExternalPollId } = require("../helpers");

const router  = express.Router();


module.exports = (db) => {
  router.get('/', (req, res) => {
    res.render('./index.ejs');
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

    .then( data => {
      pollData = data.rows[0];
      return pollData;
    })

    .then( ({ id, question, creator_id, admin_link, submission_link }) => {
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

        res.json(responseData);
      });
    });
  });

  router.get('/:id', (req, res) => {

    const externalPollId = req.params.id;

    console.log(req.params);

    const findPollQueryString = `
      SELECT id, question FROM polls
        WHERE external_uuid = $1;`;

    const findPollQueryParams = [externalPollId];

    const findChoicesQueryString = `
      SELECT title, description FROM choices
        WHERE poll_id = $1;`;

    db.query(findPollQueryString, findPollQueryParams)
    .then( pollData => pollData.rows[0])
    .then( ({ id, question }) => {
      const findChoicesQueryParams = [id];
      db.query(findChoicesQueryString, findChoicesQueryParams)
      .then( choiceData => choiceData.rows)
      .then( choices => {
        console.log(id, question);
        console.log(choices);
        const templateVars = {
          poll: {
            question
          },
          choices
        };

        res.render('./poll.ejs', templateVars);
      });
    });
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
