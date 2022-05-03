
module.exports = (db) => {
  return {
    createNewPoll: (uuid, question, creatorId, choiceCount, link) => {
      const queryString = `
        INSERT INTO polls
          (external_uuid, question, creator_id, choice_count, admin_link,
            submission_link)
          VALUES
            ($1, $2, $3, $4, $5, $6)
        RETURNING *;`; 
    
      const adminLink = link + '/admin';

      const queryParams = [uuid, question, creatorId, choiceCount,
        adminLink, link];

      return db.query(queryString, queryParams);
    },

    createNewChoices: (choices, pollId) => {
      let queryString = `
        INSERT INTO choices
          (poll_id, title, description) VALUES
            `;

      const queryParams = [];

      for (const choice in choices) {
        const description = choices[choice].describe ?
          choices[choice].describe : null;
        queryParams.push(pollId, choices[choice].title, description);
        const count = queryParams.length;
        queryString += `($${count - 2}, $${count - 1}, $${count}), `
      }

      queryString = queryString.slice(0, -2);
      queryString += '\n  RETURNING *;';

      return db.query(queryString, queryParams);
    },

    findPollByUUID: (uuid) => {
      const queryString = `
        SELECT id, question FROM polls
          WHERE external_uuid = $1;`;
      const queryParams = [uuid];

      return db.query(queryString, queryParams);
    },

    findChoicesByPollId: (pollId) => {
      const queryString = `
        SELECT id, title, description FROM choices
          WHERE poll_id = $1;`;
      const queryParams = [pollId];
      
      return db.query(queryString, queryParams);
    },

    submitVotes: (rankedChoices) => {
      let queryString = `
        INSERT INTO votes
          (choice_id, user_id, position) VALUES
            `;
      const queryParams = [];

  };
};
