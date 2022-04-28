const { v4: uuidv4 } = require('uuid');

module.exports = {
  generateExternalPollId: () => {
    return uuidv4();
  }
}
