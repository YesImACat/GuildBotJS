const CheckHandler = require('../handlers/CheckHandler');
const config = require('../config.json');
const officerRoleID = config.officerRoleID;
const guildOwnerID = config.guildOwnerID;

module.exports = {
  name: 'check',
  async execute(message, args) {
    if (!message.member.roles.cache.has(officerRoleID) && message.member.id != guildOwnerID) return message.reply("\nYou don't have permission to use that command!");

    if (args[0]) {
      CheckHandler.ProcessCheck(message, args);
    } else {
      message.reply("\nDidn't find a name in your request, try again?");
      return;
    }
  },
};
