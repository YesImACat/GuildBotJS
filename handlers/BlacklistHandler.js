const blackList = require('quick.db');
const Discord = require('discord.js');
const HypixelApi = require('./api/HypixelHandler');
const ScammerHandler = require('./api/ScammerHandler');
const MojangHandler = require('./api/MojangHandler');
const config = require('../config.json');
const guild = config.guild;

// TODO: Rewrite most of this.
class BlacklistHandler {
  async FindBlacklist(message, userName) {
    try {
      const findUUID = await MojangHandler.ReturnUUID(userName);
      const findBlacklistedUser = await blackList.get(`${findUUID}`);
      if (findBlacklistedUser) {
        await message.reply(
          `\n**Blacklisted Name:** ${findBlacklistedUser.userName}\n**Added By:** ${findBlacklistedUser.addedBy}\n**When:** ${findBlacklistedUser.when}\n**Reason:** ${findBlacklistedUser.reason}`
        );
      } else {
        message.reply('\nSomething went wrong, perhaps they changed their name?');
        return;
      }
    } catch (e) {
      console.log(e);
      message.reply('\nSomething went wrong, perhaps they changed their name?');
      return;
    }
  }

  async RunChecks(message) {
    let scammersFound = [];
    let membersTotal = 0;
    let scammerFileTotal = 0;

    const members = await HypixelApi.ReturnMemberList(message, guild);
    const scammers = await ScammerHandler.ReturnScammerList(message, guild);

    for (const member of members) {
      const checkedID = member.uuid;

      if (blackList.get(checkedID)) {
        const blacklistedUser = blackList.get(checkedID);
        message.channel.send(`\nBlacklisted user ${blacklistedUser.userName} is in ${guild}.\nReason: ${blacklistedUser.reason}`);
      }

      for (const key in scammers) {
        if (checkedID == key) {
          const scammerName = await MojangHandler.ReturnName(checkedID);
          scammersFound.push(scammerName);
        }
        scammerFileTotal++;
      }
      membersTotal++;
    }

    return this.SendResults(message, scammersFound, scammerFileTotal, membersTotal);
  }

  async SendResults(message, scammersFound, scammerFileTotal, membersTotal) {
    if (!scammersFound.length > 0) {
      return message.channel.send(`\n${membersTotal} total members were checked ${scammerFileTotal.toLocaleString()} times.\n`);
    }

    message.channel.send(`\n${membersTotal} total members were checked ${scammerFileTotal.toLocaleString()} times.\n\n\`${scammersFound}\` are on the scammer list.`);
  }

  async addToBlacklist(message, userName, resolvedUserUUID, banReason) {
    const embed = new Discord.MessageEmbed()
      .addField('Minecraft Name', userName)
      .addField('UUID', resolvedUserUUID)
      .addField('Reason', banReason)
      .setFooter('If this was a mistake, send a DM to Rina!');
    await message.reply({ embeds: [embed] });
    await blackList.set(`${resolvedUserUUID}`, {
      userName: userName,
      addedBy: message.member.displayName,
      UUID: resolvedUserUUID,
      reason: banReason,
      when: Date(),
    });
  }

  async RemoveFromBlacklist(message, userName) {
    const removedUUID = await MojangHandler.ReturnUUID(userName);
    const removedEntry = await blackList.get(`${removedUUID}`);
    if (removedEntry) {
      const deletionResult = blackList.delete(`${removedUUID}`);
      if (deletionResult) {
        message.reply(
          `\nRemoved ${userName} from the blacklist.\nOriginal name: ${removedEntry.userName}\nUUID: ${removedEntry.UUID}\nAdded by: ${removedEntry.addedBy}\nDate: ${removedEntry.when}`
        );
      } else {
        message.reply('\nSomething went wrong.');
      }
    } else {
      message.reply('\nUnable to find that person, make sure you used their current MC name.');
    }
  }
}

module.exports = new BlacklistHandler();
