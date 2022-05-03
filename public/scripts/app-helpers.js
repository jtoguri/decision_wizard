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

  const action = $(`

  <div class="d-flex justify-content-center my-4">
  <a href=${pollData.submissionLink}<button type="button" class="btn btn-warning">Looks Good</button></a>

  </div>

  <div class="d-flex justify-content-center my-4">
  <a href=${pollData.adminLink}<button type="button" class="btn btn-warning">Nope</button></a>
  </div>
  </div>

  `)

  $(content).append(poll).append(action);

  return content;
};




// pollData =
//{question: 'which bug is best',
//choices: Array(3),
//submissionLink: 'api/polls/82675d60-6688-4067-98cb-b27399aff853',
//adminLink: 'api/polls/82675d60-6688-4067-98cb-b27399aff853/admin'
//}
// adminLink: "api/polls/82675d60-6688-4067-98cb-b27399aff853/admin"
// choices: Array(3)
// 0: {title: 'black', description: null}
// 1: {title: 'polar', description: null}
// 2: {title: 'grizz', description: null}
// length: 3
// [[Prototype]]: Array(0)
// question: "which bug is best"
// submissionLink: "api/polls/82675d60-6688-4067-98cb-b27399aff853"























// const createPreviewPage = (pollData) => {
//   const message = $(`
//     <div>
//       <h2>Congrats! You just created a new poll!</h2>
//       <p>You may view a preview of your poll below and go to
//         <a href=${pollData.adminLink}>admin link</a> or
//         <a href=${pollData.submissionLink}>sub link</a>
//       </p>
//     </div>
//   `);

//   const poll = $(`
//     <div>
//       <h3>${pollData.question}</h3>
//         <ul>
//         </ul>
//     </div>
//   `);

//   for (const choice of pollData.choices) {
//     $(poll).find('ul').append(`<li>${choice.title}</li>`);
//   }

//   $(message).append(poll);

//   return message;
// };
