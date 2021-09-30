const Discord = require('discord.js');
const ScammerHandler = require('./api/ScammerHandler');
const MojangHandler = require('./api/MojangHandler');
const { ReturnSkycryptResults } = require('./api/SkyCryptHandler');

class CheckHandler {
  async ProcessCheck(message, args) {
    const scammers = await ScammerHandler.ReturnScammerList(message);
    if (!scammers) return;
    const userName = args[0];
    const userUUID = await MojangHandler.ReturnUUID(userName, message);
    if (!userUUID) return;
    const blackList = require('quick.db');

    await message.reply('\n⌛ Processing your request').then((botMessage) => {
      this.RunCheck(userUUID, scammers, blackList, userName, botMessage, message);
    });

    return;
  }

  async RunCheck(userUUID, scammers, blackList, userName, botMessage, message) {
    if (await blackList.get(`${userUUID}`)) {
      const blacklistedUser = await blackList.get(`${userUUID}`);
      const blackListedCheck = new Discord.MessageEmbed()
        .setTitle(`🚨 Blacklisted User - ${userName} 🚨`)
        .addField('Original Name', `${blacklistedUser.userName}`)
        .addField('Reason', `${blacklistedUser.reason}`)
        .addField('UUID', `${blacklistedUser.UUID}`)
        .addField('Added by', `${blacklistedUser.addedBy}`)
        .addField('When:', `${blacklistedUser.when}`);
      await botMessage.channel.send({ embeds: [blackListedCheck] });
      await botMessage.edit('This user is blacklisted:');
      return;
    } else if (scammers[userUUID]) {
      const scammerReason = await scammers[userUUID].reason;
      botMessage.edit(`\n🛑 This user is on the SBZ scammer list and should not be accepted.\nReason: ${scammerReason}`);
      return;
    } else {
      await this.requirementsCheck(userName, botMessage, message);
    }
  }

  async requirementsCheck(userName, botMessage, message) {
    const weights = [];
    const cataLevels = [];
    const skillAverages = [];

    const shiiyuResultsJson = await ReturnSkycryptResults(userName, botMessage);
    const skyCryptLink = `https://sky.shiiyu.moe/stats/${userName}/`;
    const avatarImage = `https://mc-heads.net/body/${userName}`;
    const avatarHeadImage = `https://mc-heads.net/avatar/${userName}`;

    try {
      for (const key in shiiyuResultsJson.profiles) {
        const profile = shiiyuResultsJson.profiles[key];

        if (!profile.data.dungeons.dungeonsWeight) continue;
        if (!profile.data.dungeons.catacombs.visited) continue;
        if (!profile.data.average_level_no_progress) continue;

        weights.push(Math.round(profile.data.weight));
        cataLevels.push(profile.data.dungeons.catacombs.level.level);
        skillAverages.push(profile.data.average_level_no_progress);
      }
    } catch (e) {
      console.log(e);
      botMessage.edit(`\n🛑 There was an error fetching their stats, feel free to check manually.\n
            SkyCrypt: ${skyCryptLink}`);
    }

    const highestWeight = Math.max(...weights);
    const highestCataLevel = Math.max(...cataLevels);
    const highestSkillAverage = Math.max(...skillAverages);

    const checkResults = new Discord.MessageEmbed()
      .setTitle('SkyCrypt')
      .setAuthor(userName, avatarHeadImage, skyCryptLink)
      .setImage(avatarImage)
      .setURL(skyCryptLink)
      .setTimestamp()
      .setFooter(`Check ran by ${message.author.tag}`)
      .addField('💪 Weight', highestWeight.toString(), true)
      .addField('⚔️ Catacombs', highestCataLevel.toString(), true)
      .addField('⚒ Skill Average', highestSkillAverage.toString(), true)
      .addField('Blacklisted?', 'Nope!', true)
      .addField('SBZ Scammer?', 'Nope!', true);

    if (highestWeight >= 0 && highestCataLevel >= 0 && highestSkillAverage >= 0) {
      await botMessage.edit({ content: ' ', embeds: [checkResults] });
    } else {
      await botMessage.edit(`\n⚠️ Something went wrong!\nLikely a disabled or erroneous API.\nPlease check manually.\nSkyCrypt: ${skyCryptLink}`);
    }
  }
}

module.exports = new CheckHandler();
