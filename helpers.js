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

const sendMail = () => {

  console.log(`here to send some mail!`)

  mg.messages.create(domain, {
    from: `Decision Wizard <fjord@${domain}>`,
    to: [process.env.MG_USER],
    subject: "Hello",
    text: "Testing some Mailgun awesomness!",
    html: "<h1>Testing some Mailgun awesomness!</h1>"
  })
  .then(msg => console.log(msg)) // logs response data
  .catch(err => console.log(err)); // logs any error

}







module.exports = {
  generateExternalPollId: () => {
    return uuidv4();
  },
  sendMail
}
