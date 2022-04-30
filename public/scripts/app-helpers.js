// Helper functions for the app.js file

// Confirms if a user_id cookie exists
const confirmCookie = function ()  {
  const cookieExists =  document.cookie.split('=')[1];
  return cookieExists ? true : null;
};

// Creates an HTML element containing poll information
const createPreviewPage = (pollData) => {
  const message = $(`
    <div>
      <h2>Congrats! You just created a new poll!</h2>
      <p>You may view a preview of your poll below and go to
        <a href=${pollData.adminLink}>admin link</a> or
        <a href=${pollData.submissionLink}>sub link</a>
      </p>
    </div>
  `);

  const poll = $(`
    <div>
      <h3>${pollData.question}</h3>
        <ul>
        </ul>
    </div>
  `);
  
  for (const choice of pollData.choices) {
    $(poll).find('ul').append(`<li>${choice.title}</li>`);
  }

  $(message).append(poll);

  return message;
};
