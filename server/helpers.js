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
    const email = info.email;
    const question = info.question;
    const url = `http://localhost:8080/api/polls/${info.uuid}`;

    mg.messages.create('sandboxccb09bee7c9a4f58bdecfb63b9aa73ba.mailgun.org', {
      from: `Decision Wizard <fjord@decisionwizard.com>`,
      to: email,
      subject: `${question} has a new response!`,
      text: `${question} has a new response!`,
      html: `
      <h3>${question} has a new response!</h3><br>
      Click <a href="${url}">here</a> to see the results.<br>
      &copy; Decision Wizard 2022 🧙`
    })
      .then(msg => console.log(msg)) // logs response data
      .catch(err => console.log(err)); // logs any error
  },
  sendNewPollMail: (info) => {
    const email = info.email;
    const question = info.question;
    const name = info.name;
    const url = `http://localhost:8080/api/polls/${info.externalPollId}`;

    mg.messages.create('sandboxccb09bee7c9a4f58bdecfb63b9aa73ba.mailgun.org', {
      from: `Decision Wizard <fjord@decisionwizard.com>`,
      to: email,
      subject: `You created a new poll: ${question}?`,
      text: `You created a new poll: ${question}?`,
      html: `
      <p>Hello, ${name}!<br>
      <h1>${question}?</h1><br>

      Click <a href="${url}">here</a> to make changes, or see the results.<br>
      &copy; Decision Wizard 2022 🧙`
    })
      .then(msg => console.log(msg)) // logs response data
      .catch(err => console.log(err)); // logs any error
  }
};

