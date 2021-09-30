const InactiveHandler = require('../handlers/InactiveHandler');
const MojangHandler = require('../handlers/api/MojangHandler');
const config = require('../config.json');
const prefix = config.prefix;
const officerRoleID = config.officerRoleID;
const guildOwnerID = config.guildOwnerID;

module.exports = {
  name: 'inactive',
  async execute(message, args) {
    if (!message.member.roles.cache.has(officerRoleID) && message.member.id != guildOwnerID) return message.reply("\nYou don't have permission to use that command!");
    const subCommand = await args[0];
    const userName = await args[1];
    const userUUID = await MojangHandler.ReturnUUID(userName);
    const input = await args.slice(2).join(' ');

    switch (subCommand) {
      case 'check':
        InactiveHandler.checkInactives(message);
        break;

      case 'add':
        InactiveHandler.addException(message, userName, userUUID, input);
        break;

      case 'remove':
        InactiveHandler.removeException(message, userUUID);
        break;

      default:
        message.reply(`\nThis seems invalid, maybe you did something wrong?\nTry \`${prefix}staffhelp\``);
    }
  },
};
