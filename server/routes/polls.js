/*
 * All routes for Polls are defined here
 * Since this file is loaded in server.js into api/polls,
 *   these routes are mounted onto /polls
 *
 */

const express = require('express');
const { generateExternalPollId, sendNewResponseMail, sendNewPollMail, closePollByUUID, compareEndDate } = require("../helpers");

const router  = express.Router();


module.exports = (queries) => {
  router.get('/', (req, res) => {
    res.render('./index.ejs', {user: req.cookies.user_id});
  });

  // Route to handle the creation of new polls
  router.post('/', (req, res) => {

    // Create and extract poll params to be added to the database
    const externalPollId = generateExternalPollId();
    const link = `api/polls/${externalPollId}`;
    const redirectLink = '/' + link + '/admin';
    const question = req.body.pollQuestion;
    const choices = req.body.choices;
    const choiceCount = Object.keys(choices).length;
    const creatorId = Number(req.cookies.user_id);
    const mailInfo = {question, externalPollId };
    const endDate = (req.body.end_date) ? req.body.end_date : null;

    queries.createNewPoll(externalPollId, question, creatorId,
      choiceCount, endDate, link)
      .then(data => {
        pollData = data.rows[0];
        return pollData;
      })
      .then(({ id }) => {
        return [ queries.createNewChoices(choices, id),
          queries.getPollCreatorByUUID(externalPollId)
        ];
      })
      .then(morePromises => {
        Promise.all(morePromises).then(values => {
          mailInfo.email = values[1].rows[0].email;
          mailInfo.name = values[1].rows[0].name;
          sendNewPollMail(mailInfo);
        });
      })
      .then(data => res.send(redirectLink));
  });

  router.get('/:id', (req, res) => {
    const uuid = req.params.id;
    const promises = [];
    
    promises.push(queries.getPollByUUID(uuid));
    promises.push(queries.getPollResultsByUUID(uuid));

    Promise.all(promises).then(values => {
      const poll = values[0].rows[0];
      const isClosed = compareEndDate(poll);

      const results = values[1].rows;
      console.log(poll, results);
      res.render("poll", { poll, user: req.cookies.user_id, isClosed,
      results});
    });
  });

  router.get('/:id/admin', (req, res) => {
    const uuid = req.params.id;
    const promises = [];
    const user = req.cookies.user_id;

    promises.push(queries.findPollByUUID(uuid),
      queries.getPollResultsByUUID(uuid));

    Promise.all(promises).then(values => {
      const poll = values[0].rows[0];
      const results = values[1].rows;
      const isClosed = compareEndDate(poll);

      res.render("admin", { poll, results, user, isClosed });
    });
  });

  router.post('/:id', (req, res) => {

    const ranking = req.body.choice;
    const userId = req.cookies.user_id ? Number(req.cookies.user_id) : null;
    const uuid = req.params.id;

    queries.submitVotes(ranking, userId)
      .then(choices => {
        const choiceIds = [];
        for (const choice of choices.rows) {
          choiceIds.push(choice.choice_id);
        }
        return [ queries.getPollResults(choiceIds),
          queries.getPollCreatorByUUID(uuid),
          queries.getPollByUUID(uuid) ];
      })
      .then(promises => {
        Promise.all(promises).then(values => {
          const pollResults = values[0].rows;
          res.json(pollResults);

          //pass query data to mailgun
          const info = {
            email: values[1].rows[0].email,
            uuid: values[1].rows[0].uuid,
            question: values[2].rows[0].question
          };
          sendNewResponseMail(info);
        });
      });
  });

  router.post('/:id/close', (req, res) => {
    const uuid = req.params.id;
    queries.closePollByUUID(uuid)
    .then(() => {
      res.redirect(`/api/polls/${uuid}/admin`);
    });
  });
  return router;

};
