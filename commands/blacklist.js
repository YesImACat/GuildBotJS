const blackList = require('quick.db');
const MojangHandler = require('../handlers/api/MojangHandler');
const BlacklistHandler = require('../handlers/BlacklistHandler');
const config = require('../config.json');
const prefix = config.prefix;
const officerRoleID = config.officerRoleID;
const guildOwnerID = config.guildOwnerID;

module.exports = {
  name: 'blacklist',
  async execute(message, args) {
    if (!message.member.roles.cache.has(officerRoleID) && message.member.id != guildOwnerID) return message.reply("\nYou don't have permission to use that command!");

    const subCommand = args[0];
    const userName = args[1];
    const banReason = args.slice(2).join(' ');

    switch (subCommand) {
      case 'check':
        BlacklistHandler.RunChecks(message);
        return;

      case 'add':
        if (userName && banReason) {
          const resolvedUserUUID = await MojangHandler.ReturnUUID(userName);
          if (blackList.get(`${resolvedUserUUID}`)) {
            message.channel.send('Looks like that user is already blacklisted.');
          } else {
            BlacklistHandler.addToBlacklist(message, userName, resolvedUserUUID, banReason);
          }
        } else {
          message.reply('\nYou must input a username followed by a ban reason.');
        }

        break;

      case 'find':
        if (userName) {
          BlacklistHandler.FindBlacklist(message, userName);
        } else {
          message.reply('\nYou must input a username.');
        }

        break;

      case 'remove':
        if (userName) {
          BlacklistHandler.RemoveFromBlacklist(message, userName);
        } else {
          message.reply('\nYou must input a username.');
        }

        break;

      default:
        message.reply(`\nThis seems invalid, maybe you did something wrong?\nTry \`${prefix}staffhelp\``);
        return;
    }
  },
};
