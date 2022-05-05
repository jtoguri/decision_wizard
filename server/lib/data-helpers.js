
module.exports = (db) => {
  return {
    createNewPoll: (uuid, question, creatorId, choiceCount, endDate, link) => {
      const queryString = `
        INSERT INTO polls
          (external_uuid, question, creator_id, choice_count, end_date, admin_link,
            submission_link)
          VALUES
            ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;`;

      const adminLink = link + '/admin';

      const queryParams = [uuid, question, creatorId, choiceCount, endDate,
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

    getPollByUUID: (uuid) => {
      const queryString = `
        SELECT polls.question, array_agg(choices.id) AS ids, array_agg(choices.title) AS choices,
        array_agg(choices.description) AS descriptions
          FROM choices
            JOIN polls on polls.id = choices.poll_id
          WHERE polls.external_uuid = $1
        GROUP BY polls.id;`;
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

    submitVotes: (rankedChoices, userId) => {
      let queryString = `
        INSERT INTO votes
          (choice_id, user_id, position) VALUES
            `;
      const queryParams = [];

      for (let i = 0; i < rankedChoices.length; i++) {
        const choiceId = Number(rankedChoices[i]);
        const position = i + 1;

        queryParams.push(choiceId, userId, position);
        const count = queryParams.length;
        queryString += `($${count - 2}, $${count - 1}, $${count})`;

        if (i < rankedChoices.length - 1) {
          queryString += ', ';
        }
      }

      queryString += `\n  RETURNING choice_id;`;

      return db.query(queryString, queryParams);
    },

    getPollResults: (choices) => {
      let queryString = `
        SELECT choices.id, choices.title, choices.description,
          SUM(choice_count-position) AS score
            FROM choices
          JOIN votes ON choices.id = votes.choice_id
          JOIN polls ON polls.id = choices.poll_id
            WHERE choice_id IN (`;

      const queryParams = [];

      for (let i = 0; i < choices.length; i++) {
        queryParams.push(choices[i]);
        const count = queryParams.length;
        queryString += `$${count}`;
        if (i < choices.length - 1) {
          queryString += ', ';
        }
      }

      queryString += ') GROUP BY choices.id ORDER BY score DESC;';

      return db.query(queryString, queryParams);
    },
        //SELECT array_agg(choiceID) as ranking, array_agg(title) as
        //titles, array_agg(sum) as scores FROM

    getPollResultsByUUID: (uuid) => {
      const queryString = `
          SELECT polls.question, choices.id as choiceId, choices.title
          as title, SUM(choice_count - position) as score
            FROM choices
              JOIN polls ON polls.id = choices.poll_id
              LEFT JOIN votes ON votes.choice_id = choices.id
            WHERE polls.external_uuid = $1
          GROUP BY choices.id, polls.question;`;

      const queryParams = [uuid];

      return db.query(queryString, queryParams);

    },

    getPollCreatorByUUID: (uuid) => {
      const queryString = `
        SELECT users.name, users.email, polls.external_uuid as uuid
          FROM polls
          JOIN users on users.id = polls.creator_id
            WHERE polls.external_uuid = $1;`
      const queryParams = [uuid];

      return db.query(queryString, queryParams);
    }
  };
};
