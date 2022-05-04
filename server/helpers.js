const { v4: uuidv4 } = require('uuid');
const domain = process.env.MG_DM;

//mailgun config
require('dotenv').config();
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: 'api', key: process.env.MG_PK });


//on vote submission:
//Send 'username' has voted for '#1 choice' in your 'what shoud we eat for dinner' poll

const sendMail = (info) => {
  const email = info.rows[0].email;
  const question = info.rows[0].question;
  const url = `http://localhost:8080/api/polls/${info.rows[0].id}`;

  mg.messages.create('sandboxccb09bee7c9a4f58bdecfb63b9aa73ba.mailgun.org', {
    from: `Decision Wizard <fjord@${domain}>`,
    to: email,
    subject: `${question} has a new response!`,
    text: `${question} has a new response!`,
    html: `
    <h3>${question} has a new response!</h3><br>
    Click <a href="${url}">here</a> to see the results.`
  })
    .then(msg => console.log(msg)) // logs response data
    .catch(err => console.log(err)); // logs any error


};

module.exports = {
  generateExternalPollId: () => {
    return uuidv4();
  },
  sendMail
};



