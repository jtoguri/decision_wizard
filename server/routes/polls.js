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
    const uuid = req.params.id;
    
    queries.submitVotes(ranking, userId)
    .then(choices => {
      const choiceIds = [];
      for (const choice of choices.rows) {
        choiceIds.push(choice.choice_id);
      }
      return [ queries.getPollResults(choiceIds),
        queries.getPollCreatorByUUID(uuid) ];
    })
    .then( promises => {
      Promise.all(promises).then(values => {
        const pollResults = values[0].rows;
        res.json(pollResults);

        const creatorInfo = values[1].rows[0];
        console.log(creatorInfo);
      });
    });
/*
    queryParams3 = [`${req.params.id}`];

        res.json(data2.rows);
      })
      .then(() => {
        return db.query(queryString3, queryParams3);
      })
      .then(data3 => {
        sendMail(data3);
        //do things with mailgun
      });

*/
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
