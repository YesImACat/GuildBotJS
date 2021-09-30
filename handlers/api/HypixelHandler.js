const fetch = require('node-fetch');
const config = require('../../config.json');
const hypixelKey = config.hypixelKey;
const guild = config.guild;
const Discord = require('discord.js');
const MojangHandler = require('./MojangHandler');

class HypixelHandler {
  async setPresence(client) {
    let totalMembers = 0;
    try {
      const members = await this.ReturnMemberList();
      const guildMembers = members.length;

      totalMembers = totalMembers + guildMembers;
    } catch (e) {
      console.log(e);
    }

    client.user.setPresence({ activities: [{ name: `${totalMembers} members`, type: 'WATCHING' }] });
  }

  async ReturnMemberList() {
    try {
      const hypixelGuildResponse = await fetch(`https://api.hypixel.net/guild?name=${guild}&key=${hypixelKey}`);
      const memberListJson = await hypixelGuildResponse.json();
      const members = await memberListJson.guild.members;
      return members;
    } catch (e) {
      console.log(e);
    }
  }

  async ReturnFullGuildInfo() {
    try {
      const hypixelGuildResponse = await fetch(`https://api.hypixel.net/guild?name=${guild}&key=${hypixelKey}`);
      const guildInfo = await hypixelGuildResponse.json();
      return guildInfo;
    } catch (e) {
      console.log(e);
    }
  }

  async ReturnMember(message, memberName) {
    try {
      const memberList = await this.ReturnMemberList();
      if (!memberList) return;
      const memberUUID = await MojangHandler.ReturnUUID(memberName, message);
      if (!memberUUID) return;
      const resolvedName = await MojangHandler.ReturnName(memberUUID, message);
      if (!resolvedName) return;

      let memberEmbed;
      let memberFound = false;

      for (const key in memberList) {
        const member = memberList[key];
        let history = member.expHistory;
        const date = new Date(member.joined);
        let totalXP = 0;

        history = Object.values(history);

        totalXP = history.reduce(function (a, b) {
          return a + b;
        }, 0);

        if (member.uuid == memberUUID) {
          memberFound = true;
          memberEmbed = new Discord.MessageEmbed()
            .setTimestamp()
            .setFooter(`Requested by ${message.author.tag}`)
            .setTitle(resolvedName)
            .addField('UUID', member.uuid.toString())
            .addField('Rank', member.rank.toString())
            .addField('Joined', date.toString())
            .addField('GEXP in the last week', totalXP.toLocaleString());
        } else {
          continue;
        }
      }

      if (memberFound) {
        message.channel.send({ embeds: [memberEmbed] });
      } else {
        message.channel.send("Wasn't able to find that member.");
      }
    } catch (e) {
      console.log(e);
    }
  }

  async ReturnHypixelMember(uuid) {
    try {
      const hypixelResponse = await fetch(`https://api.hypixel.net/player?uuid=${uuid}&key=${hypixelKey}`);
      const hypixelMember = await hypixelResponse.json();
      return hypixelMember;
    } catch (e) {
      console.log(e);
    }
  }

  async ReturnStatus(member) {
    const uuid = await MojangHandler.ReturnUUID(member);

    const hypixelResponse = await fetch(`https://api.hypixel.net/status?uuid=${uuid}&key=${hypixelKey}`);
    const hypixelResponseJson = hypixelResponse.json();

    return hypixelResponseJson;
  }

  async ReturnWatchdogStats() {
    const hypixelReponse = await fetch(`https://api.hypixel.net/punishmentstats?key=${hypixelKey}`);
    const stats = hypixelReponse.json();
    return stats;
  }

  async ReturnPlayerCount() {
    const hypixelResponse = await fetch(`https://api.hypixel.net/counts?key=${hypixelKey}`);
    const count = hypixelResponse.json();
    return count;
  }
}

module.exports = new HypixelHandler();
