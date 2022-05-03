const { v4: uuidv4 } = require('uuid');

//mailgun config
require('dotenv').config();
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: 'api', key: process.env.MG_PK });


module.exports = {
  generateExternalPollId: () => {
    return uuidv4();
  },
  sendNewResponseMail: (info) => {
    const email = info.rows[0].email;
    const question = info.rows[0].question;
    const url = `http://localhost:8080/api/polls/${info.rows[0].id}`;

    mg.messages.create('sandboxccb09bee7c9a4f58bdecfb63b9aa73ba.mailgun.org', {
      from: `Decision Wizard <fjord@decisionwizard.com>`,
      to: email,
      subject: `${question} has a new response!`,
      text: `${question} has a new response!`,
      html: `
      <h3>${question} has a new response!</h3><br>
      Click <a href="${url}">here</a> to see the results.`
    })
      .then(msg => console.log(msg)) // logs response data
      .catch(err => console.log(err)); // logs any error
  },
  sendNewPollMail: (info) => {
    // const email = info.rows[0].email;
    // const question = info.rows[0].question;
    // const url = `http://localhost:8080/api/polls/${info.rows[0].id}`;

    // mg.messages.create('sandboxccb09bee7c9a4f58bdecfb63b9aa73ba.mailgun.org', {
    //   from: `Decision Wizard <fjord@decisionwizard.com>`,
    //   to: email,
    //   subject: `${question} has a new response!`,
    //   text: `${question} has a new response!`,
    //   html: `
    //   <h3>${question} has a new response!</h3><br>
    //   Click <a href="${url}">here</a> to see the results.`
    // // })
    //   .then(msg => console.log(msg)) // logs response data
    //   .catch(err => console.log(err)); // logs any error
  }





};



//sendMail => sendNewPollMail, sendNewResponseMail

// responsedata = {
//   question: 'What should I be when I grow up?',
//   choices: [
//     { title: 'Accountant', description: null },
//     { title: 'Doctor', description: null },
//     { title: 'Wizard', description: null }
//   ],
//   submissionLink: 'api/polls/55e71f26-93c6-4268-91e7-6513641f56c5',
//   adminLink: 'api/polls/55e71f26-93c6-4268-91e7-6513641f56c5/admin'
// }
