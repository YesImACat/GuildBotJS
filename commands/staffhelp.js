const Discord = require('discord.js');
const config = require('../config.json');
const prefix = config.prefix;
const officerRoleID = config.officerRoleID;
const guildOwnerID = config.guildOwnerID;

module.exports = {
  name: 'staffhelp',
  description: 'Displays this help page.',
  async execute(message) {
    if (!message.member.roles.cache.has(officerRoleID) && message.member.id != guildOwnerID) return message.reply("\nYou don't have permission to use that command!");

    const helpEmbed = new Discord.MessageEmbed()
      .setTitle('Bot Commands')
      .setDescription('[] = Required arguments')
      .setFooter('Bot created by rina#4911')
      .setColor('#6eb1f5')
      .addField(
        'Blacklist',
        `${prefix}\`blacklist check\`
        Checks all members of the guild against our blacklist and the SBZ scammer list.
        \n${prefix}\`blacklist add [MC NAME] [REASON]\`
        Adds a user to the blacklist.
        \n${prefix}\`blacklist find [MC NAME]\`
        Finds a blacklisted user and sends back the details.`
      )

      .addField(
        'Check',
        `\`${prefix}check [MC NAME]\`
        Checks a Minecraft name for current requirements, our blacklist, and the SBZ scammer list`
      )

      .addField(
        'Inactive',
        `\`${prefix}inactive check\`
        Displays inactive members in the guild. Only kick these people to make room for new members.
        \n\`${prefix}inactive add [MC NAME] [NOTE]\`
        Adds an exception note to a user if they appear on the inactive list.
        \n\`${prefix}inactive remove [MC NAME] [NOTE]\`
        Removes a user from the inactive kicklist.`
      )

      .addField(
        'Help',
        `\`${prefix}help\`
        Displays an embed with various commands and useful info.`
      );

    message.reply({ embeds: [helpEmbed] });
  },
};
