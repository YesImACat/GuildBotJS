const Discord = require('discord.js');
const config = require('../config.json');
const prefix = config.prefix;

module.exports = {
  name: 'help',
  description: 'Displays this help page.',
  async execute(message) {
    const helpEmbed = new Discord.MessageEmbed()
      .setTitle('Bot Commands')
      .setDescription('[] = Required arguments')
      .setFooter('Bot created by rina#4911')
      .setColor('#6eb1f5')

      .addField(
        'Pic',
        `\`${prefix}pic [Mentioned User]\`
        Displays a Discord user's avatar, and attempts to upscale it.`
      )

      .addField(
        'Discordmember',
        `\`${prefix}discordmember [Mentioned User]\`
        Displays some extra details about a Discord member.`
      )

      .addField(
        'Suggestions',
        `\`${prefix}suggest [Suggestion]\`
        Sends your suggestion to the suggestions channel for community members to vote on. Must be > 20 characters.`
      )

      .addField(
        'Watchdog',
        `\`${prefix}watchdog\`
        Outputs the watchdog statistics as reported from the Hypixel API.`
      )

      .addField(
        'Online',
        `\`${prefix}online [Hypixel User]\`
        Tells you if a Hypixel user is online, and if so what game they are playing.`
      )

      .addField(
        'Count',
        `\`${prefix}count\`
        Displays current hypixel player count.`
      )

      .addField(
        'Help',
        `\`${prefix}help\`
        Displays an embed with various commands and useful info.`
      )

      .addField(
        'Staffhelp',
        `\`${prefix}staffhelp\`
        Displays an embed for staff commands.`
      );

    message.reply({ embeds: [helpEmbed] });
  },
};
