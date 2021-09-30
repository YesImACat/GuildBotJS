const HypixelHandler = require('../handlers/api/HypixelHandler');
const config = require('../config.json');
const prefix = config.prefix;

module.exports = {
  name: 'member',
  async execute(message, args) {
    const memberName = args[0];
    let guildName = args[1] + ' ' + args[2];

    if (memberName && guildName) {
      HypixelHandler.ReturnMember(message, memberName, guildName);
    } else {
      message.reply(`\nInvalid, correct usage: \`\`${prefix}${this.name} NAME GUILD\`\``);
      return;
    }
  },
};
