/*
 * All routes for Polls are defined here
 * Since this file is loaded in server.js into api/polls,
 *   these routes are mounted onto /polls
 *
 */

const express = require('express');
const { generateExternalPollId, sendMail } = require("../helpers");

const router  = express.Router();


module.exports = (queries) => {
  router.get('/', (req, res) => {
    res.render('./index.ejs', {user: req.cookies.user_id});
  });

  // Route to handle the creation of new polls
  router.post('/', (req, res) => {

    // Create and extract the necessary poll parameters to be added to
    // the database
    const externalPollId = generateExternalPollId();
    const link = `api/polls/${externalPollId}`;
    const redirectLink = '/' + link + '/admin';
    const question = req.body.pollQuestion;
    const choices = req.body.choices;
    const choiceCount = Object.keys(choices).length;
    const creatorId = Number(req.cookies.user_id);

    queries.createNewPoll(externalPollId, question, creatorId,
      choiceCount, link) 
    .then(data => {
        pollData = data.rows[0];
        return pollData;
    })
    .then(({ id }) => {
      return queries.createNewChoices(choices, id);
    })
    .then(data => res.redirect(redirectLink));
  });

  router.get('/:id', (req, res) => {
    const externalPollId = req.params.id;
    
    queries.findPollByUUID(externalPollId)
    .then(data => data.rows[0])
    .then(({ id, question }) => {
      queries.findChoicesByPollId(id)
      .then(data => {
        const choices = data.rows;
        const templateVars = {
          poll: {
            question
          },
          choices,
          user: req.cookies.user_id
        };
        
        res.render('poll', templateVars);
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
        sendMail(data3);
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
