const VerifyHandler = require('../handlers/VerifyHandler');
const config = require('../config.json');
const prefix = config.prefix;

module.exports = {
  name: 'verify',
  async execute(message, args) {
    const name = args[0];
    if (!name) return message.reply(`You must type your Minecraft name after ${prefix}verify`);

    VerifyHandler.VerifyRequest(message, name);
  },
};
