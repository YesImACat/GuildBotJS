const HypixelHandler = require('./api/HypixelHandler');
const { ReturnName } = require('./api/MojangHandler');
const quickdb = require('quick.db');
const config = require('../config.json');
const guild = config.guild;
const inactiveLimit = config.inactiveLimit + 1; // This check includes the current day, so we add one to check full days only.

const db = new quickdb.table('afk');

class InactiveHandler {
  async checkInactives(message) {
    const members = await HypixelHandler.ReturnMemberList(guild);
    const inactiveMembers = [];
    for (const member in members) {
      let xp = members[member].expHistory;
      const uuid = members[member].uuid;
      const rank = members[member].rank;
      let inactiveDays = 0;

      const excepted = db.has(`${uuid}`);
      let exceptedNote;

      if (rank === 'Officer' || rank === 'Leader' || rank === 'Guild Master' || rank === 'Bridge') {
        continue;
      }

      xp = Object.values(xp);
      xp = xp.slice(0, inactiveLimit);
      for (const value in xp) {
        const currentIteration = xp[value];
        if (currentIteration === 0) {
          inactiveDays++;
        }
      }
      // 259200000 = 3 days in ms
      if (inactiveDays >= inactiveLimit && Date.now() - members[member].joined > 259200000 && !excepted) {
        const name = await ReturnName(uuid);
        inactiveMembers.push(`${name}`);
      }

      if (inactiveDays >= inactiveLimit && Date.now() - members[member].joined > 259200000 && excepted) {
        const name = await ReturnName(uuid);
        exceptedNote = await db.get(`${uuid}.note`);
        inactiveMembers.push(`\`${name}\`` + ' | **Exception**: ' + `\`${exceptedNote}\``);
      }
    }

    if (inactiveMembers[0]) {
      const output = inactiveMembers.join(' \n');
      message.channel.send(`\`\`\`Inactives for ${guild}:\n\n${output}\`\`\``);
    } else {
      message.channel.send(`\nUnable to find any inactive members in ${guild}.`);
    }
  }

  async addException(message, userName, userUUID, input) {
    await db.set(`${userUUID}`, {
      name: userName,
      addedBy: message.member.displayName,
      note: input,
    });
    await message.reply(`Added ${userName} to the exception list with note: \`${input}\``);
  }

  async removeException(message, userUUID) {
    const foundUser = db.get(`${userUUID}`);
    if (foundUser) {
      db.delete(`${userUUID}`);
      await message.reply(`\nRemoved ${foundUser.name} from the exception list.`);
    }
  }
}

module.exports = new InactiveHandler();
