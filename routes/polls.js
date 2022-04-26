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
    console.log('create a new poll in the db');
    //assuming no method override?
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
