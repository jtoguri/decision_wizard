// Helper functions for the app.js file

// Confirms if a user_id cookie exists
const confirmCookie = function ()  {
  const cookieExists =  document.cookie.split('=')[1];
  return cookieExists ? true : null;
};

// Creates an HTML element containing poll information
const createPreviewPage = (pollData) => {

  const content = $(`
    <div class="container d-flex flex-column align-items-center">

    <div class="alert alert-info" role="alert">
    Here is a preview of your poll</div>

    </div>
  `);


  //generates the poll element
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

  //generate the action buttons
  const action = $(`

  <div class="d-flex justify-content-center my-4">
  <a href=${pollData.adminLink}<button type="button" class="btn btn-primary">Looks Good</button></a>

  </div>

  </div>

  `)

  $(content).append(poll).append(action);

  return content;
};
















