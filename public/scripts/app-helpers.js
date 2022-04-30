// Helper functions for the app.js file

// Confirms if a user_id cookie exists
const confirmCookie = function ()  {
  const cookieExists =  document.cookie.split('=')[1];
  return cookieExists ? true : null;
};

const createPollElement = (pollData) => {
  const preview = $(`
    <div>
      <h3>${pollData.question}</h3>
        <ul>
        </ul>
    </div>
  `);

  for (const choice of pollData.choices) {
    $(preview).find('ul').append(`<li>${choice.title}</li>`);
  }

  return preview;
};
